// components/CollapsibleBlogList.tsx
'use client';

import BlogCard from '@/components/BlogCard';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { useState } from 'react';

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  content: string | null;
}

interface PostWithTags extends Post {
  tags: Tag[];
}

interface CollapsibleBlogListProps {
  allTags: Tag[];
  filteredPosts: PostWithTags[];
  filteredPostsByTag: Record<number, PostWithTags[]>;
  postsByTag: Record<number, PostWithTags[]>;
  allUntaggedPosts: PostWithTags[];
}

const CollapsibleBlogList: React.FC<CollapsibleBlogListProps> = ({
  allTags,
  filteredPosts,
  filteredPostsByTag,
  postsByTag,
  allUntaggedPosts,
}) => {
  const [expandedTags, setExpandedTags] = useState<Record<number, boolean>>({});

  const toggleTag = (tagId: number) => {
    setExpandedTags((prev) => ({
      ...prev,
      [tagId]: !prev[tagId],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Tags as Folders */}
      {allTags.map((tag) => (
        <div key={tag.id} className="rounded-md border border-gray-700">
          <button
            onClick={() => toggleTag(tag.id)}
            className="flex items-center justify-between w-full p-4 focus:outline-none"
          >
            <div className="flex items-center space-x-2">
              {expandedTags[tag.id] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <Folder size={16} />
              <span className="font-medium">{tag.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {filteredPostsByTag[tag.id]?.length ||
                postsByTag[tag.id]?.length ||
                0}
            </span>
          </button>
          {expandedTags[tag.id] && (
            <div className="px-6 pb-4 space-y-2">
              {(filteredPostsByTag[tag.id] || postsByTag[tag.id])?.map(
                (post) => (
                  <div
                    key={post.id}
                    className="ml-6 flex items-center space-x-2"
                  >
                    <File size={18} />
                    <BlogCard post={post} />
                  </div>
                )
              )}
              {(!filteredPostsByTag[tag.id] ||
                filteredPostsByTag[tag.id]?.length === 0) &&
                (!postsByTag[tag.id] || postsByTag[tag.id]?.length === 0) && (
                  <p className="text-gray-400 ml-6">
                    No entries in this category.
                  </p>
                )}
            </div>
          )}
        </div>
      ))}

      {/* Untagged Posts Folder */}
      {allUntaggedPosts.length > 0 && (
        <div className="rounded-md border border-gray-700">
          <button
            onClick={() => toggleTag(-2)}
            className="flex items-center justify-between w-full p-4 focus:outline-none"
          >
            <div className="flex items-center space-x-2">
              {expandedTags[-2] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <Folder size={16} />
              <span className="font-medium">Tools and Unsorted</span>
            </div>
            <span className="text-sm text-gray-500">
              {allUntaggedPosts.length}
            </span>
          </button>
          {expandedTags[-2] && (
            <div className="px-6 pb-4 space-y-2">
              {allUntaggedPosts.map((post) => (
                <div key={post.id} className="ml-6 flex items-center space-x-2">
                  <File size={14} />
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollapsibleBlogList;
