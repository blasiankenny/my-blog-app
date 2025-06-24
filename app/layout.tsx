import "./globals.css";
import Providers from "./providers"; // ← 修正: 正しいパスでインポート
import Navbar from "@/components/Navbar"; // ← エイリアス推奨
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ メタデータ定義
export const metadata = {
  title: {
    default: "My Blog App",
    template: "%s | My Blog App",
  },
  description: "これは Next.js で作られたブログアプリです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800 min-h-screen">
        <Providers>
          <header className="bg-white shadow">
            <Navbar />
          </header>
          <main className="container mx-auto px-4 py-6">{children}</main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
