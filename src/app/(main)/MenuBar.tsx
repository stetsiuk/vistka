import Link from "next/link";
import { Bookmark, Home } from "lucide-react";

import { validateRequest } from "@/auth";
import { NotificationButton } from "@/app/(main)/NotificationButton";
import { MessagesButton } from "@/app/(main)/MessagesButton";
import { Button } from "@/components/ui/button";
import streamServerClient from "@/lib/stream";
import prisma from "@/lib/prisma";

interface MenuBarProps {
  className?: string;
}

export async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />

      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
