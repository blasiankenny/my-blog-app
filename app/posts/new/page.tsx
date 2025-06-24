"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        author: "仮ユーザー", // 後でログインユーザー名に置き換え可能
      }),
    });

    if (res.ok) {
      toast.success("投稿が保存されました！");
      setTitle("");
      setContent("");
    } else {
      const error = await res.json();
      toast.error("投稿に失敗しました: " + error.error);
    }
  };

  return (
    <main className="px-4 py-12 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        新規投稿
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-md rounded-xl p-6"
      >
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="本文"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          投稿する
        </button>
      </form>
    </main>
  );
}
