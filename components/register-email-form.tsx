'use client';

import { useEffect } from 'react';

import { action } from '@/app/actions/register-email-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Submitting...' : 'Get Started'}
      <Sparkles className={cn('ml-2 h-4 w-4', pending && 'animate-spin')} />
    </Button>
  );
}

export const RegisterEmailForm = () => {
  const { toast } = useToast();
  const [state, formAction] = useFormState(action, { message: '' });

  useEffect(() => {
    if (state.message) {
      if (typeof state.message === 'string') {
        if (state.message.toLowerCase().includes('duplicate')) {
          toast({
            description: (
              <div className='text-lg font-semibold text-sky-700'>
                You have already subscribed.
              </div>
            )
          });
        } else {
          toast({
            description: (
              <div className='text-lg font-semibold text-green-700'>
                {state.message}
              </div>
            )
          });
        }
      } else {
        toast({
          variant: 'destructive',
          description: (
            <div className='text-lg font-semibold'>
              <ul>
                {state.message.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.message]);

  return (
    <div className='w-full max-w-sm space-y-2'>
      <form className='flex flex-col space-y-4' action={formAction}>
        <Input
          className='max-w-lg flex-1'
          placeholder='What should we call you?'
          autoComplete='off'
          type='text'
          name='name'
          required
        />
        <Input
          className='max-w-lg flex-1'
          placeholder='Enter your email'
          autoComplete='off'
          autoCapitalize='off'
          type='email'
          name='email'
          required
        />
        <SubmitButton />
      </form>
      <p className='text-xs text-muted-foreground'>
        Subscribe and be the first to know when we launch.
      </p>
    </div>
  );
};
