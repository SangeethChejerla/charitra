'use client';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { TimeAgo } from './TimeAgo';

interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
}

interface BlogCardProps {
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
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
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
            <TimeAgo post={post} />
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
