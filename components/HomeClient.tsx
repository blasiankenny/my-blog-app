// app/HomeClient.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function HomeClient() {
  const { data: session } = useSession();

  return (
    <main className="flex items-center justify-center py-24 px-4 bg-gray-100 min-h-[80vh]">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm text-center">
        {session ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              ようこそ、{session.user?.name} さん！
            </h1>
            <button
              onClick={() => signOut()}
              className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              ログインしてください
            </h1>
            <button
              onClick={() => signIn("github", { callbackUrl: "/posts" })}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              GitHubでログイン
            </button>
          </>
        )}
      </div>
    </main>
  );
}
