// components/BlogCard.tsx
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

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(post.createdAt);

  return (
    <Link href={`/entry/${post.slug}`} className="w-full">
      <motion.div
        className="group relative p-4 rounded-md bg-black/30 hover:bg-black/50 transition-all duration-300 overflow-hidden cursor-pointer"
        onMouseMove={onMouseMove}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.17, 0.67, 0.83, 0.67],
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 40%
              )
            `,
          }}
        />
        <div className="relative h-full flex flex-col justify-between gap-2">
          <motion.h3
            className="text-lg font-semibold text-white"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            {post.title}
          </motion.h3>
          <motion.div
            className="flex items-center space-x-2 text-white/80"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <span className="h-1 w-6 bg-cyan-400 rounded-full" />
            <p className="text-sm text-gray-300 font-mono tracking-tight">
              {formattedDate}
            </p>
          </motion.div>
        </div>
        <motion.div
          className="absolute inset-0 ring-1 ring-white/20 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      </motion.div>
    </Link>
  );
}
