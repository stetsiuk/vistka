"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";

import { MessageCountInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";

interface Props {
  initialState: MessageCountInfo;
}

export function MessagesButton({ initialState }: Props) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
}
