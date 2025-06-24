import { headers, cookies } from "next/headers";
import EditPostClientPage from "../../../../components/EditPostClientPage";

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const headersList = await headers(); // ✅ await を追加
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const cookieHeader = cookies().toString(); // Cookie を取得して文字列化

  let post: Post | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: "no-store", // 編集用に常に最新データを取得
      headers: {
        Cookie: cookieHeader, // Cookie を送信
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`ID ${id} の投稿が見つかりませんでした。`);
        post = null;
      } else {
        throw new Error(`投稿取得に失敗しました: ${res.statusText}`);
      }
    } else {
      post = await res.json();
    }
  } catch (err) {
    console.error("投稿取得エラー:", err);
    post = null;
  }

  return <EditPostClientPage initialPost={post} />;
}
