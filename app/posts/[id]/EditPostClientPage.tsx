"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
});

type FormData = z.infer<typeof formSchema>;

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

export default function EditPostClientPage({
  initialPost,
}: {
  initialPost: Post | null;
}) {
  const router = useRouter();
  const [errorInitialData, setErrorInitialData] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialPost?.title || "",
      content: initialPost?.content || "",
    },
  });

  useEffect(() => {
    if (!initialPost) {
      setErrorInitialData("編集する投稿が見つかりません。");
    }
  }, [initialPost]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!initialPost?.id) {
        throw new Error("投稿IDがありません。");
      }

      const res = await fetch(`/api/posts/${initialPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "投稿の更新に失敗しました。");
      }

      toast.success("投稿を更新しました！");
      router.push(`/posts/${initialPost.id}`);
    } catch (err: unknown) {
      console.error("投稿更新エラー:", err);
      if (err instanceof Error) {
        toast.error(`投稿の更新に失敗しました: ${err.message}`);
      } else {
        toast.error("投稿の更新に失敗しました: 不明なエラーが発生しました。");
      }
    }
  };

  if (errorInitialData) {
    return (
      <main className="p-6 max-w-xl mx-auto text-center text-red-600">
        <p>エラー: {errorInitialData}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          戻る
        </button>
      </main>
    );
  }

  if (!initialPost && !errorInitialData) {
    return (
      <main className="p-6 max-w-xl mx-auto text-center">
        <p>投稿データを読み込み中か、エラーが発生しました...</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-12 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        投稿を編集
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white shadow-md rounded-xl p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            placeholder="タイトル"
            {...register("title")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            本文
          </label>
          <textarea
            id="content"
            placeholder="本文"
            {...register("content")}
            className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "更新中..." : "更新する"}
        </button>
      </form>
    </main>
  );
}
