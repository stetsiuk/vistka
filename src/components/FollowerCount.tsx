"use client";

import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface Props {
  userId: string;
  initialState: FollowerInfo;
}

export function FollowerCount({ userId, initialState }: Props) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
