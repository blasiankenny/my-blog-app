"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="text-lg font-bold text-blue-600">
        <Link href="/">My Blog</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          ホーム
        </Link>
        <Link href="/posts" className="text-gray-700 hover:text-blue-600">
          投稿一覧
        </Link>
        <Link href="/posts/new" className="text-gray-700 hover:text-blue-600">
          新規投稿
        </Link>

        {status === "loading" ? null : session ? (
          <>
            <span className="text-sm text-gray-600">
              {session.user?.name} さん
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-red-600 text-sm"
            >
              ログアウト
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            ログイン
          </button>
        )}
      </div>
    </nav>
  );
}
