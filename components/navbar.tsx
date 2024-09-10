import { Camera } from 'lucide-react';
import Link from 'next/link';

import { ModeToggle } from './mode-toggle';

export const Navbar = () => {
  return (
    <header className='flex h-14 items-center border-b px-4 lg:px-6'>
      <Link className='flex items-center justify-center' href='/'>
        <Camera className='h-6 w-6 text-primary' />
        <span className='ml-2 text-2xl font-bold text-foreground'>
          PhotoRAG - RAG Hack
        </span>
      </Link>
      <nav className='ml-auto flex items-center gap-4 sm:gap-6'>
        <Link
          className='text-sm font-medium text-muted-foreground hover:text-foreground'
          href='#'
        >
          Features
        </Link>
        <Link
          className='text-sm font-medium text-muted-foreground hover:text-foreground'
          href='#'
        >
          About
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
};
