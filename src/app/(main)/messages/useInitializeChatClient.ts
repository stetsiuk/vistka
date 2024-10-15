"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

import { useSession } from "@/app/(main)/SessionProvider";
import kyInstance from "@/lib/ky";

export function useInitializeChatClient() {
  const { user } = useSession();

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);
    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then(({ token }) => token),
      )
      .catch((error) => {
        console.log("Failed to connect to user", error);
      })
      .then(() => {
        setChatClient(client);
      });

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => {
          console.log("Failed to disconnect user", error);
        })
        .then(() => {
          console.log("Connection closed");
        });
    };
  }, [user.avatarUrl, user.displayName, user.id, user.username]);

  return chatClient;
}
