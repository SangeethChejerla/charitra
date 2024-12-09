'use client';

import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet';

export default function NavBar() {
  // Use a media query to determine if the screen is smaller than 825px
  const isMobile = useMediaQuery('(max-width: 825px)');

  return (
    <div className="flex items-center min-w-full w-full justify-center p-2 z-99">
      <div className="flex min-h-[60px] justify-between md:w-[620px] w-[95%] mt-[1rem] border border-gray-350 dark:border-zinc-900 dark:bg-black bg-opacity-10 relative backdrop-filter backdrop-blur-lg bg-white border-opacity-20 rounded-xl p-2 shadow-lg">
        {/* Mobile Navigation (Sheet) */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader></SheetHeader>
              <div className="flex flex-col space-y-3 mt-[1rem]">
                <Link href="/" passHref legacyBehavior>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-start"
                  >
                    <Home className="mr-2 h-4 w-4" /> Home
                  </Button>
                </Link>
                <Link href="/entry" passHref legacyBehavior>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Entry
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <NavigationMenu>
              <NavigationMenuList>
                <Link href="/" passHref legacyBehavior>
                  <a className="pl-2 flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                  </a>
                </Link>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <Link href="/entry" passHref legacyBehavior>
                    <Button asChild variant="ghost">
                      <a>Entry</a>
                    </Button>
                  </Link>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
