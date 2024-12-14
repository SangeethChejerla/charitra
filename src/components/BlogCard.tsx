'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Link from 'next/link';

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  tags: Tag[];
  className: string;
}

export interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link href={`/entry/${post.slug}`}>
      <motion.div
        className="group relative p-6 rounded-3xl backdrop-blur-lg bg-black/30 hover:bg-black/50 transition-all duration-300 overflow-hidden cursor-pointer"
        onMouseMove={onMouseMove}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.17, 0.67, 0.83, 0.67],
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                800px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 40%
              )
            `,
          }}
        />
        <div className="relative h-full flex flex-col justify-between gap-6 p-6">
          <motion.h2
            className="text-4xl font-bold text-white" // Changed the color of the title
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {post.title}
          </motion.h2>
          <motion.div
            className="flex items-center space-x-3 text-white/80"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="h-1 w-12 bg-cyan-400 rounded-full" />
            <TimeAgo date={post.createdAt} />
          </motion.div>
        </div>
        <motion.div
          className="absolute inset-0 ring-1 ring-white/20 rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      </motion.div>
    </Link>
  );
}

function TimeAgo({ date }: { date: Date }) {
  function timeAgo(date: Date): string {
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

  return (
    <p className="text-sm text-gray-300 font-mono tracking-tight">
      {timeAgo(date)}
    </p>
  );
}
