import { headers, cookies } from "next/headers";
import PostClientPage from "./PostClientPage";

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  const headersList = await headers();
  const host = headersList.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const cookieHeader = cookies().toString(); // Cookieを取得して文字列化

  let post: Post | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader, // Cookieを送信
      },
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
    post = null;
  }

  return <PostClientPage initialPost={post} />;
}
