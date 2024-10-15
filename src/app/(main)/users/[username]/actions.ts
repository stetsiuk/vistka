"use server";

import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { validateRequest } from "@/auth";
import { getUserDataSelect } from "@/lib/types";
import streamServerClient from "@/lib/stream";
import prisma from "@/lib/prisma";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  return await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });

    await streamServerClient.partialUpdateUser({
      id: updatedUser.id,
      set: {
        name: updatedUser.displayName,
      },
    });

    return updatedUser;
  });
}
