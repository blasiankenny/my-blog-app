// app/posts/[id]/edit/page.tsx (This is now a Server Component)
// No "use client" directive here.

import EditPostClientPage from "..//EditPostClientPage"; // Import the new Client Component

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
};

// Async Server Component to fetch data
export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // Access params.id directly in Server Component

  let post: Post | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: "no-store", // Ensure fresh data for editing
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Post with ID ${id} not found for editing.`);
        post = null; // Explicitly set to null if not found
      } else {
        throw new Error(`Failed to fetch post for editing: ${res.statusText}`);
      }
    } else {
      post = await res.json();
    }
  } catch (err) {
    console.error("Error in Server Component fetching post for edit:", err);
    // You might want to handle this error more gracefully, e.g., redirect to an error page
    post = null; // Ensure null if any error
  }

  // Pass the fetched data to the Client Component
  return <EditPostClientPage initialPost={post} />;
}
