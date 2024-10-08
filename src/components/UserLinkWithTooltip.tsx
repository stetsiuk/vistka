"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

import { UserTooltip } from "@/components/UserTooltip";
import { UserData } from "@/lib/types";
import kyInstance from "@/lib/ky";

interface Props extends PropsWithChildren {
  username: string;
}

export function UserLinkWithTooltip({ children, username }: Props) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry: (failureCount, error) => {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
