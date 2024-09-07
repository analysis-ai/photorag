import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mb-4 flex justify-center'>
            <CheckCircle className='h-12 w-12 text-green-500' />
          </div>
          <CardTitle className='text-2xl font-bold'>
            Subscription Confirmed!
          </CardTitle>
          <CardDescription>
            Thank you for verifying your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground'>
            You are all set to receive our latest updates and exclusive content.
          </p>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button asChild>
            <Link href='/'>Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
