import { getPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = getPosts();
  return NextResponse.json(posts);
}
