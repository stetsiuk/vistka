import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { CommentPage, PostData } from "@/lib/types";
import { CommentInput } from "@/components/comments/CommentInput";
import { Comment } from "@/components/comments/Comment";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";

interface Props {
  post: PostData;
}

export function Comments({ post }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages?.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments
        </p>
      )}
      <div className="divide-y">
        {comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}
