"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";

import { FollowerInfo, UserData } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { FollowerCount } from "@/components/FollowerCount";
import { FollowButton } from "@/components/FollowButton";
import { Linkify } from "@/components/Linkify";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Props extends PropsWithChildren {
  user: UserData;
}

export function UserTooltip({ children, user }: Props) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton initialState={followerState} userId={user.id} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount initialState={followerState} userId={user.id} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
