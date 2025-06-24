# My Blog App

Next.js（App Router）と TypeScript を使ったブログアプリです。GitHub 認証、投稿の作成・編集・削除機能を備えています。

## 🔧 使用技術

- Next.js 15
- TypeScript
- App Router
- Tailwind CSS
- NextAuth.js（GitHub 認証）
- React Toastify（通知）

## 🚀 ローカル開発

```bash
npm install
npm run dev


// 認証設定
.env.local に以下を設定してください：

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_secret
```

## 📦 ビルドと本番起動

```bash
npm run build
npm start

```
