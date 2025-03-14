import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { VideoGetOneOutput } from "../../types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess() {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error(error.message);
        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess() {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error(error.message);
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        variant={"secondary"}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsUpIcon
          className={cn(
            "size-5 ",
            viewerReaction === "like" && "fill-black dark:fill-white"
          )}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        className="rounded-l-none rounded-r-full pl-3"
        variant={"secondary"}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            viewerReaction === "dislike" && "fill-black dark:fill-white"
          )}
        />
        {dislikes}
      </Button>
    </div>
  );
};
