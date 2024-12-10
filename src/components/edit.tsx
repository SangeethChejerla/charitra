'use client';

import { updateBlogAction } from '@/actions/entryAction';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/mult-select';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { JSONContent } from 'novel';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';
import Calendar from './Calendar';
import NovelEditor from './editor/editor';

interface Tag {
  id: number;
  name: string;
}

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  description: string;
  editorContent: JSONContent;
  tags: number[];
  createdAt: string;
}

interface DraftContent {
  title: string;
  description: string;
  date: string | null;
  content: string;
  editorContent: JSONContent;
  slug: string;
  tags: number[];
}

const PREDEFINED_TAGS: Tag[] = [
  { id: 1, name: 'AI' },
  { id: 2, name: 'Programming' },
  { id: 3, name: 'Entertainment' },
  { id: 4, name: 'Philosophy' },
  { id: 5, name: 'Productivity' },
  { id: 6, name: 'Other' },
];

const DRAFT_STORAGE_KEY = 'blog-draft-content';

const defaultEditorContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export default function EditBlogPage({ post }: { post: BlogPost }) {
  const isInitialMount = useRef(true);

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(post.createdAt)
  );
  const [title, setTitle] = useState<string>(post.title || '');
  const [slug, setSlug] = useState<string>(post.slug || '');
  const [content, setContent] = useState<string>(post.content || '');
  const [description, setDescription] = useState<string>(
    post.description || ''
  );
  const [editorContent, setEditorContent] = useState<JSONContent>(
    post.editorContent || defaultEditorContent
  );
  const [selectedTags, setSelectedTags] = useState<number[]>(post.tags || []);
  const [pending, setPending] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>(PREDEFINED_TAGS);
  const [metadataPreview, setMetadataPreview] = useState<{
    title: string;
    description: string;
  }>({
    title: '',
    description: '',
  });
  const router = useRouter();

  // Set initial values from `post` prop
  useEffect(() => {
    setSelectedDate(new Date(post.createdAt));
    setTitle(post.title || '');
    setSlug(post.slug || '');
    setContent(post.content || '');
    setDescription(post.description || '');
    setEditorContent(post.editorContent || defaultEditorContent);
    setSelectedTags(post.tags || []);
    setIsMounted(true);
  }, [post]);

  useEffect(() => {
    // Update metadata preview when title and description change
    if (isMounted && title && description) {
      const generatedSlug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'en',
      });
      setSlug(generatedSlug);
      setMetadataPreview({
        title: `${title} | MicroMacro's Blog`,
        description: description,
      });
    }
  }, [title, description, isMounted]);

  // Load draft from local storage (if available)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          try {
            const parsedDraft: DraftContent = JSON.parse(savedDraft);

            // Only update fields that are not already populated from `post`
            if (!title) setTitle(parsedDraft.title || '');
            if (!description) setDescription(parsedDraft.description || '');
            if (!content) setContent(parsedDraft.content || '');
            if (!editorContent)
              setEditorContent(
                parsedDraft.editorContent || defaultEditorContent
              );
            if (!slug) setSlug(parsedDraft.slug || '');
            if (!selectedTags.length) setSelectedTags(parsedDraft.tags || []);
            if (!selectedDate && parsedDraft.date) {
              setSelectedDate(new Date(parsedDraft.date));
            }
          } catch (error) {
            console.error('Error parsing saved draft:', error);
          }
        }
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const draftContent: DraftContent = {
        title,
        description,
        date: selectedDate?.toISOString() || null,
        content,
        editorContent,
        slug,
        tags: selectedTags,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftContent));
    }
  }, [
    title,
    description,
    selectedDate,
    content,
    editorContent,
    slug,
    selectedTags,
    isMounted,
  ]);

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const clearDraft = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setEditorContent(defaultEditorContent);
    setSelectedDate(new Date(post.createdAt));
    setSlug('');
    setSelectedTags([]);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    toast.success('Draft cleared!');
  };

  const handleEditorChange = (
    htmlContent: string,
    jsonContent: JSONContent
  ) => {
    setContent(htmlContent);
    setEditorContent(jsonContent);
  };

  async function handleSubmit() {
    if (!selectedDate) {
      toast.error('Please select a date.');
      return;
    }
    if (!title) {
      toast.error('Please enter a title.');
      return;
    }
    if (!content) {
      toast.error('Please enter content for your blog.');
      return;
    }
    if (!description) {
      toast.error('Please enter a description for your blog.');
      return;
    }
    if (selectedTags.length === 0) {
      toast.error('Please select at least one tag.');
      return;
    }

    const formattedDateString = format(selectedDate, 'yyyy-MM-dd');
    setPending(true);

    try {
      const result = await updateBlogAction({
        slug,
        title,
        content,
        //@ts-ignore
        description,
        editorContent,
        tags: selectedTags,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Blog entry updated successfully!');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to update blog entry. Please try again.');
    } finally {
      setPending(false);
    }
  }

  const tagOptions = availableTags.map((tag) => ({
    label: tag.name,
    value: tag.id.toString(),
  }));

  return (
    <div className="space-y-6">
      <div className="mb-16 flex items-center justify-between">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Edit Blog Entry
          </h1>
          <div className="mb-4">
            <p className="text-gray-400 text-center">
              Originally created on:{' '}
              {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={clearDraft} variant="outline">
              Clear Draft
            </Button>
            <Button onClick={handleSubmit} disabled={pending}>
              {pending ? 'Updating...' : 'Update Entry'}
            </Button>
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
          <Input
            type="text"
            placeholder="Description for SEO and sharing"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {selectedDate
                    ? format(selectedDate, 'MMMM dd, yyyy')
                    : 'Select Date'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Select Date</DialogTitle>
                <Calendar
                  onDaySelect={
                    setSelectedDate as Dispatch<SetStateAction<Date | null>>
                  }
                  selectedDate={selectedDate}
                  // This is for a new post so no need to check if date has entry
                  isDateWithEntry={() => false}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tagId) => {
                const tag = availableTags.find((t) => t.id === tagId);
                return tag ? (
                  <div
                    key={tag.id}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ) : null;
              })}
            </div>

            <MultiSelector
              values={selectedTags.map((tagId) => tagId.toString())}
              onValuesChange={(values: string[]) => {
                setSelectedTags(values.map((value) => parseInt(value, 10)));
              }}
              loop={false}
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder="Select tags" />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {tagOptions.map((option, i) => (
                    <MultiSelectorItem key={i} value={option.value}>
                      {option.label}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6">
        <h2 className="text-xl font-bold mb-4">Metadata Preview</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="mb-2">
            <strong>Title:</strong> {metadataPreview.title}
          </p>
          <p>
            <strong>Description:</strong> {metadataPreview.description}
          </p>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden mt-6">
        <NovelEditor
          initialValue={editorContent}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
