import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Post {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

export function getPosts(): Post[] {
  const files = fs.readdirSync('./content/blog');
  const posts: Post[] = [];
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const filePath = path.join('./content/blog', file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    posts.push({
      slug: file.replace('.mdx', ''),
      frontmatter,
      content,
    });
  }
  
  return posts.sort((a, b) => 
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}
