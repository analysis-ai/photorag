import { Camera } from 'lucide-react';
import ImageSearchGallery from '@/components/image-search-gallery';
import { ModeToggle } from '@/components/mode-toggle';
import MultiImageUpload from '@/components/multi-image-upload';
import { RegisterEmailForm } from '@/components/register-email-form';

export default async function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <header className='flex h-14 items-center border-b px-4 lg:px-6'>
        <a className='flex items-center justify-center' href='#'>
          <Camera className='h-6 w-6 text-primary' />
          <span className='ml-2 text-2xl font-bold text-foreground'>
            PhotoRAG by PhotoMuse.ai
          </span>
        </a>
        <nav className='ml-auto flex items-center gap-4 sm:gap-6'>
          <a
            className='text-sm font-medium text-muted-foreground hover:text-foreground'
            href='#'
          >
            Features
          </a>
          <a
            className='text-sm font-medium text-muted-foreground hover:text-foreground'
            href='#'
          >
            About
          </a>
          <ModeToggle />
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
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
              <MultiImageUpload />
              <RegisterEmailForm />
            </div>
          </div>
        </section>
      </main>
      <footer className='flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6'>
        <p className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} PhotoMuse.ai. All rights reserved.
        </p>
        <nav className='flex gap-4 sm:ml-auto sm:gap-6'>
          <a
            className='text-xs text-muted-foreground hover:text-foreground'
            href='https://github.com/analysis-ai/photorag'
            target='_blank'
            rel='noreferrer'
          >
            Public Repo
          </a>
          <a
            className='text-xs text-muted-foreground hover:text-foreground'
            href='https://www.danwise.dev/'
            target='_blank'
            rel='noreferrer'
          >
            DanWise.Dev
          </a>
        </nav>
      </footer>
    </div>
  );
}
