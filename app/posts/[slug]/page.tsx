import Image from 'next/image';
import { getPost } from '@/lib/posts';

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
        <Image src={featured} alt={post.title.rendered} width={800} height={500} style={{ width: '20%', height: 'auto' }} />
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
