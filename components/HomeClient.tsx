"use client";

export default function HomeClient() {
  return (
    <main className="flex items-center justify-center py-24 px-4 bg-gray-100 min-h-[80vh]">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ようこそ、ゲストさん！
        </h1>
        <p className="text-gray-600">ログイン機能は現在無効化されています。</p>
      </div>
    </main>
  );
}
