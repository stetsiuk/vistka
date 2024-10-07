"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { createPostSchema } from "@/lib/validation";
import { getPostDataInclude } from "@/lib/types";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content,
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
