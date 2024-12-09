// TimeAgo.tsx
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: Date; // This should be a Date object, not a string
}
// Component to display the time ago for a single post
export const TimeAgo: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <p className="text-sm text-gray-300 font-mono tracking-tight">
      {timeAgo(post.createdAt.toString())}
    </p>
  );
};
