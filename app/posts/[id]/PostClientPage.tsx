"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

export default function PostClientPage({
  initialPost,
}: {
  initialPost: Post | null;
}) {
  const router = useRouter();
  const [post] = useState<Post | null>(initialPost);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(
    !initialPost ? "投稿が見つかりません。" : null
  );
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setDeleteError(null);

    try {
      if (!post?.id) throw new Error("投稿IDがありません。");

      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("投稿の削除に失敗しました");

      router.push("/posts");
    } catch (err: unknown) {
      console.error("削除エラー:", err);
      setDeleteError(
        err instanceof Error ? err.message : "不明なエラーが発生しました。"
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 max-w-2xl mx-auto text-center">
        <p>削除処理中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-2xl mx-auto text-center text-red-600">
        <p>エラー: {error}</p>
        <Link
          href="/posts"
          className="text-blue-500 hover:underline mt-4 block"
        >
          投稿一覧に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
      <p className="text-gray-700 whitespace-pre-wrap mb-6">{post?.content}</p>

      <div className="text-sm text-gray-600 mb-6">
        <p>
          投稿者: <strong>{post?.author}</strong>
        </p>
        <p>投稿日時: {post?.createdAt}</p>
      </div>

      <div className="flex space-x-4">
        <Link
          href={`/posts/${post?.id}/edit`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          編集
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          削除
        </button>
      </div>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">確認</h2>
            <p className="mb-4">本当にこの投稿を削除しますか？</p>
            {deleteError && (
              <p className="text-sm text-red-600 mb-2">エラー: {deleteError}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/posts" className="text-blue-500 hover:underline">
          &larr; 投稿一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
