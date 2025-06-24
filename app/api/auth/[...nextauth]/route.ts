// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/posts`; // ログイン後に /posts にリダイレクト
    },
  },
});

export { handler as GET, handler as POST };
