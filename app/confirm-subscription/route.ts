import { getURL } from '@/lib/utils';
import { EmailRegister } from '@/models'; // You'll need to implement this
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract the token from the URL
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const user = await EmailRegister.verifyByToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Redirect to a success page or return a success response
    return NextResponse.redirect(new URL('/subscription-confirmed', getURL()));
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return NextResponse.json(
      { error: 'An error occurred while confirming your subscription' },
      { status: 500 }
    );
  }
}
