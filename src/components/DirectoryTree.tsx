// DirectoryTree.tsx
'use client';

import { Folder, Link } from 'lucide-react';
import TreeItem from './TreeItem';

const DirectoryTree = () => {
  console.log('Rendering DirectoryTree component');

  const links = [
    { name: 'Github', url: 'https://github.com/Aryayama-Nyx' },
    { name: 'Portfolio', url: 'https://aryayama-nyx.vercel.app' },
    { name: 'myanimelist', url: 'https://myanimelist.net/profile/AryayamaNyx' },
  ];

  const projects = [
    { name: '___', url: 'https://project-alpha.example.com' },
    { name: 'PromptPal', url: 'https://promptpal-cyan.vercel.app/' },
    { name: 'MarkView', url: 'https://markview-eight.vercel.app/' },
  ];

  return (
    <div className="text-white p-6 rounded-md shadow-md font-mono text-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Folder className="text-blue-400" size={20} />
        <span>
          C:<span className="text-purple-500">/</span>Users
          <span className="text-purple-500">/</span>arya
          <span className="text-purple-500">/</span>
        </span>
      </div>
      <div className="ml-6">
        <TreeItem
          name="Links"
          level={1}
          prefix="├─"
          icon={<Folder className="text-yellow-500" size={18} />}
          textSize="text-base"
        />
        <div className="ml-4">
          {links.map((link, index) => (
            <TreeItem
              key={index}
              name={link.name}
              level={2}
              prefix={index === links.length - 1 ? '└─' : '├─'}
              isLink
              icon={<Link className="text-green-400" size={18} />}
              url={link.url}
              textSize="text-base"
            />
          ))}
        </div>

        <TreeItem
          name="Projects"
          level={1}
          prefix="└─"
          icon={<Folder className="text-yellow-500" size={18} />}
          textSize="text-base"
        />
        <div className="ml-4">
          {projects.map((project, index) => (
            <TreeItem
              key={index}
              name={project.name}
              level={2}
              prefix={index === projects.length - 1 ? '└─' : '├─'}
              isLink
              icon={<Link className="text-green-400" size={18} />}
              url={project.url}
              textSize="text-base"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectoryTree;
