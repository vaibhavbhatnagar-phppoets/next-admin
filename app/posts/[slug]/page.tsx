// app/posts/[slug]/page.tsx
import Image from 'next/image';

type Post = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia': { source_url: string }[]
    author?: { name: string }[];
  };
};

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.SITE_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
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

// export default async function PostPage({ params }: Props) {
//   const post = await getPost(params.slug);
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; product_detail: string }>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) return <p>Post not found or fetch failed.</p>;

  const featured = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const authorName = post._embedded?.author?.[0]?.name || 'Unknown author';



  return (
    <div style={{ padding: '2rem' }} className='w-full max-w-7xl mx-auto px-4 *:'>
      <div className="">Author: {authorName}</div>
      {featured && (
        <Image
          src={featured}
          alt={post.title.rendered}
          width={800}
          height={500}
          style={{ width: '20%', height: 'auto' }}
        />
      )}
      <h1>{post.title.rendered}</h1>
      <div
        className="
    [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4
    [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
    [&_li]:mb-2
    [&_p]:mb-4 [&_p]:text-gray-700
    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-4
    [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800
  "
        dangerouslySetInnerHTML={{ __html: post.content.rendered || '' }}
      />

    </div>
  );
}
