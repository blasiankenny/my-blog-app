// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin?callbackUrl=/profile");

  const user = session.user!;
  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <div className="flex items-center gap-4">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email ?? "メール未取得"}</p>
        </div>
      </div>
    </section>
  );
}
