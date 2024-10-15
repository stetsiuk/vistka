import { Metadata } from "next";

import { Chat } from "@/app/(main)/messages/Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return <Chat />;
}
