"use server";

import { validateRequest } from "@/auth";
import { createPostSchema } from "@/lib/validation";
import { getPostDataInclude } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      userId: user.id,
      content,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
