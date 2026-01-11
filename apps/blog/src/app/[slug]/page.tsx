import { getPosts } from '@/lib/posts';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';

interface Post {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = getPosts();
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title || 'Blog Post',
    description: post.frontmatter.description || 'Blog post by Amartya Singh',
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const posts = getPosts();
  const post = posts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Amartya Singh Blog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <article>
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              {post.frontmatter.title || 'Untitled Post'}
            </h1>
            {post.frontmatter.date && (
              <time dateTime={post.frontmatter.date} className="text-muted-foreground">
                {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.frontmatter.author && (
              <span className="ml-4 text-muted-foreground">
                by {post.frontmatter.author}
              </span>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>
    </div>
  );
}
