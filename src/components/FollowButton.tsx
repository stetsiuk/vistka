"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FollowerInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export function FollowButton({ userId, initialState }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { toast } = useToast();

  const { data } = useFollowerInfo(userId, initialState);

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, _, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
