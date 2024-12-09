import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Calendar, Github, LinkIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
        <div className="flex items-center justify-between px-6 h-16">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-zinc-800"
          ></Button>
          <h1 className="text-2xl font-bold tracking-tight">Aryayama Nyx</h1>
          <div className="w-10"></div> {/* Spacer for symmetric layout */}
        </div>

        <div className="relative aspect-[3/1] overflow-hidden">
          <Image
            src="/images/bng.png"
            alt="Piano keys illustration"
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
            fill
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300"></div>
        </div>

        {/* Profile Section */}
        <div className="px-6 pb-6 flex-grow">
          <div className="flex flex-col items-center -mt-16 mb-6 space-y-4">
            <Avatar className="h-32 w-32 rounded-full border-4 border-black shadow-xl ring-4 ring-zinc-800 hover:ring-blue-500 transition-all duration-300">
              <AvatarImage src="/images/profile.png" alt="Profile picture" />
              <AvatarFallback className="bg-zinc-700 text-white">
                AN
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Aryayama Nyx
                </h2>
                <BadgeCheck className="h-6 w-6 text-blue-500 animate-pulse" />
              </div>
              <p className="text-zinc-400 text-base">@sangeeth_rch</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto text-center">
            <p className="text-[16px] leading-relaxed text-zinc-300 italic mb-6 bg-zinc-900/50 p-4 rounded-xl">
              "Suddenly, I started shaking, but not because I was cold or the
              weather was bad. It wasn't even because I was scared. I was
              probably just excited and nervous."
            </p>

            <div className="flex justify-center flex-wrap gap-4 text-zinc-400">
              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Bharat</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span className="text-sm">December 2</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full">
                <LinkIcon className="h-5 w-5 text-green-400" />
                <a
                  href="https://aryayama-nyx.vercel.app"
                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                >
                  My Portfolio
                </a>
              </div>

              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full">
                <Github className="h-5 w-5 text-green-400" />
                <a
                  href="https://myanimelist.net/profile/AryayamaNyx"
                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                >
                  Github
                </a>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-full">
                <LinkIcon className="h-5 w-5 text-green-400" />
                <a
                  href="https://myanimelist.net/profile/AryayamaNyx"
                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                >
                  My Anime List
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
