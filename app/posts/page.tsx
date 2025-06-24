"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

export default function PostList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        alert("投稿の取得に失敗しました");
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <p className="text-center text-gray-500 mt-10">セッション確認中...</p>
    );
  }

  return (
    <main className="px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        ブログ一覧
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">読み込み中...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/posts/${post.id}`}>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{post.content}</p>
                  <div className="text-sm text-gray-500">
                    by <strong>{post.author}</strong> ({post.createdAt})
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/posts/new"
          className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
        >
          ＋ 新規投稿
        </Link>
      </div>
    </main>
  );
}
