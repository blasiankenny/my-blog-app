export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/posts/:path*"], // /posts とその配下を保護
};
