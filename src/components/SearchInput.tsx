'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200); // 500ms debounce time

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedQuery, pathname, router, searchParams]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery(''); // Also clear debouncedQuery
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search the Keywords..."
        value={query}
        onChange={handleInputChange}
        className="w-full pl-10 pr-10 h-12 bg-white/10 border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-purple-400 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:focus:ring-gray-800"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
