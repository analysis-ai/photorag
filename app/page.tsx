import ImageSearchGallery from '@/components/image-search-gallery';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-28 xl:py-32'>
          <div className='mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Welcome to PhotoRAG by PhotoMuse.ai
                </h1>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  RAG HACK submission that leverages Azure AI and infrastructure
                  to build a RAG application for photographs.
                </p>
              </div>
              <ImageSearchGallery />

              {/* <MultiImageUpload /> */}
            </div>
          </div>
        </section>
      </main>
      <footer className='flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6'>
        <p className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} PhotoMuse.ai. All rights reserved.
        </p>
        <nav className='flex gap-4 sm:ml-auto sm:gap-6'>
          <Link
            className='text-xs text-muted-foreground hover:text-foreground'
            href='https://github.com/dubscode/photorag'
            target='_blank'
            rel='noreferrer'
          >
            Public Repo
          </Link>
          <Link
            className='text-xs text-muted-foreground hover:text-foreground'
            href='https://www.danwise.dev/'
            target='_blank'
            rel='noreferrer'
          >
            DanWise.Dev
          </Link>
        </nav>
      </footer>
    </div>
  );
}
