'use client';

import { createBlogAction } from '@/actions/entryAction';
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
import { JSONContent } from 'novel';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';
import Calendar from './Calendar';
import NovelEditor from './editor/editor';

interface Tag {
  id: number;
  name: string;
}

interface BlogEntry {
  date: string;
  title: string;
  content: string;
  description: string;
  editorContent: JSONContent;
  tags: number[];
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
const ENTRIES_STORAGE_KEY = 'blog-entries';

const defaultEditorContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export default function BlogEditor() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // State for description
  const [editorContent, setEditorContent] =
    useState<JSONContent>(defaultEditorContent);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [blogEntries, setBlogEntries] = useState<BlogEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>(PREDEFINED_TAGS);
  const [metadataPreview, setMetadataPreview] = useState<{
    title: string;
    description: string;
  }>({
    title: '',
    description: '',
  });

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        const savedEntries = localStorage.getItem(ENTRIES_STORAGE_KEY);

        if (savedDraft) {
          try {
            const parsedDraft: DraftContent = JSON.parse(savedDraft);
            setTitle(parsedDraft.title || '');
            setDescription(parsedDraft.description || ''); // Load saved description
            setContent(parsedDraft.content || '');
            setEditorContent(parsedDraft.editorContent || defaultEditorContent);
            setSlug(parsedDraft.slug || '');
            setSelectedTags(parsedDraft.tags || []);

            if (parsedDraft.date) {
              setSelectedDate(new Date(parsedDraft.date));
            }
          } catch (error) {
            console.error('Error parsing saved draft:', error);
          }
        }

        if (savedEntries) {
          try {
            setBlogEntries(JSON.parse(savedEntries));
          } catch (error) {
            console.error('Error parsing saved entries:', error);
          }
        }

        setIsMounted(true);
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

      // Update metadata preview
      if (title && description) {
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
    setDescription(''); // Clear description
    setContent('');
    setEditorContent(defaultEditorContent);
    setSelectedDate(null);
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
      const result = await createBlogAction({
        date: formattedDateString,
        title,
        slug,
        content,
        // @ts-ignore
        description,
        tags: selectedTags,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Blog entry created successfully!');
        setBlogEntries((prev) => [
          ...prev,
          {
            date: formattedDateString,
            title,
            content,
            description,
            editorContent,
            tags: selectedTags,
          },
        ]);
        clearDraft();
      }
    } catch (error) {
      toast.error('Failed to create blog entry. Please try again.');
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
            Create Blog Entry
          </h1>
          <div className="space-x-2">
            <Button onClick={clearDraft} variant="outline">
              Clear Draft
            </Button>
            <Button onClick={handleSubmit} disabled={pending}>
              {pending ? 'Submitting...' : 'Create Entry'}
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
                  isDateWithEntry={(date) =>
                    blogEntries.some(
                      (entry) => entry.date === format(date, 'yyyy-MM-dd')
                    )
                  }
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
