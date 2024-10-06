import { postDataInclude } from "@/lib/types";
import { TrendsSidebar } from "@/components/TrendsSidebar";
import { PostEditor } from "@/components/posts/editor/PostEditor";
import { Post } from "@/components/posts/Post";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  );
}
