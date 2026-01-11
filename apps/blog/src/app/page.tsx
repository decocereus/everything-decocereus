"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.frontmatter.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.frontmatter.description && post.frontmatter.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Amartya Singh Blog
          </Link>
          <nav className="flex gap-2">
            <a
              href="https://decocereus.dev"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Portfolio
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-foreground">
          Blog
        </h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="border-b pb-8">
              {post.frontmatter.date && (
                <time dateTime={post.frontmatter.date} className="text-sm text-muted-foreground">
                  {new Date(post.frontmatter.date).toLocaleDateString()}
                </time>
              )}
              {post.frontmatter.category && (
                <span className="ml-2 text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                  {post.frontmatter.category}
                </span>
              )}
              <Link href={`/${post.slug}`}>
                <h2 className="text-2xl font-semibold text-foreground hover:text-muted-foreground transition-colors mt-2">
                  {post.frontmatter.title || 'Untitled Post'}
                </h2>
              </Link>
              <p className="mt-2 text-muted-foreground">
                {post.frontmatter.description || 'No description'}
              </p>
              {post.frontmatter.tags && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(post.frontmatter.tags as string[]).map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
