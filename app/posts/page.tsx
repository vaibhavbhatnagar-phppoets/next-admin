// app/posts/page.tsx
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/router';

type Post = {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt?: { rendered: string };
  content?: { rendered: string };
  date?:string;
  _embedded?: { 'wp:featuredmedia': { source_url: string }[] };
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.SITE_URL}/wp-json/wp/v2/posts?_embed`,
    { next: { revalidate: 60 } } // ISR
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();


  return (
    <div style={{ display: 'grid', gap: '2rem', padding: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {posts.map((post) => {
        const featured = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        const description = post.excerpt?.rendered || post.content?.rendered;
        const date = post.date;

        return (
          <Link key={post.id} href={`/posts/${post.slug}`}>


            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              {date}
              <a href="#">
                {/* <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" /> */}
                {featured && (
                  <Image
                    src={featured}
                    alt={post.title.rendered}
                    width={600}
                    height={400}
                    style={{ width: '30%', height: 'auto' }}
                  />
                )}
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title.rendered}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"  dangerouslySetInnerHTML={{ __html: description || '' }} /> 

                <Link href={`/posts/${post.slug}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Read more
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </Link>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
