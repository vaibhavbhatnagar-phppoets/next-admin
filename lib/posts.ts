// lib/posts.ts

type Post = {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt?: { rendered: string };
  content: { rendered: string };
  date?: string;
  _embedded?: {
    [key: string]: any; // 👈 allows author, categories, etc.
  };
};

// Fetch all posts
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?_embed`,
    { next: { revalidate: 60 } } // ISR
  );
  if (!res.ok) return [];
  return res.json();
}

// Fetch a single post by slug or ID 
export async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error('Fetch failed with status:', res.status);
      return null;
    }

    const posts: Post[] = await res.json();
    return posts[0] ?? null; // Return first post if exists
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
}
