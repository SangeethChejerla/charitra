import DirectoryTree from '@/components/DirectoryTree';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
        <div className="flex items-center justify-between px-6 h-16">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-zinc-800"
          >
            {/* You can add a hamburger icon or your logo here */}
          </Button>
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
            <p className="text-[16px] leading-relaxed mb-6  p-4 rounded-xl">
              "Suddenly, I started shaking, but not because I was cold or the
              weather was bad. It wasn't even because I was scared. I was
              probably just excited and nervous."
            </p>
            <DirectoryTree />
          </div>
        </div>
      </div>
    </main>
  );
}
