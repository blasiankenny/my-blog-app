// components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function Header() {
  const pathname = usePathname();
  const { status } = useSession();

  // NextAuth の認証系画面では常に非表示
  const isAuthPage =
    pathname?.startsWith("/api/auth/") || pathname === "/api/auth/signin";

  // ✅ 未ログインホーム & ローディング中ホームも非表示にする
  const isAnonymousOrLoadingHome =
    pathname === "/" && status !== "authenticated";

  if (isAuthPage || isAnonymousOrLoadingHome) {
    return null; // ヘッダー非表示
  }

  return (
    <header className="bg-white shadow">
      <Navbar />
    </header>
  );
}
