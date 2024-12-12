import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json(
      { message: 'Missing path param' },
      { status: 400 }
    );
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
