// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false} // フォーカスでの再フェッチを抑制
      refetchInterval={0} // 定期再フェッチしない
      refetchWhenOffline={false} // オフライン復帰時の再フェッチを抑制
    >
      {children}
    </SessionProvider>
  );
}
