import { NextRequest } from "next/server";

import { getPostDataInclude, PostPage } from "@/lib/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: pageSize + 1,
      orderBy: { createdAt: "desc" },
      include: getPostDataInclude(user.id),
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
