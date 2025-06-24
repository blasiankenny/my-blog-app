// Server Component
import PostClientPage from "./PostClientPage";

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  let post: Post | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Post with ID ${id} not found.`);
        post = null;
      } else {
        throw new Error(`Failed to fetch post: ${res.statusText}`);
      }
    } else {
      post = await res.json();
    }
  } catch (err) {
    console.error("Error fetching post:", err);
  }

  return <PostClientPage initialPost={post} />;
}
