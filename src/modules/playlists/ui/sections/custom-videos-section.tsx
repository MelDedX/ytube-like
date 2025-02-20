"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkelton,
} from "@/modules/videos/ui/components/video-gird-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface CustomVideosSectionProps {
  playlistId: string;
}

export const CustomVideosSection = ({
  playlistId,
}: CustomVideosSectionProps) => {
  return (
    <Suspense fallback={<CustomVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CustomVideosSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CustomVideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex md:hidden flex-col gap-4 gap-y-10">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkelton key={index} />
        ))}
      </div>{" "}
      <div className="hidden md:flex flex-col gap-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size={"compact"} />
        ))}
      </div>
    </div>
  );
};
const CustomVideosSectionSuspense = ({
  playlistId,
}: CustomVideosSectionProps) => {
  const utils = trpc.useUtils();
  const [videos, query] =
    trpc.playlists.getCustomVideos.useSuspenseInfiniteQuery(
      {
        playlistId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video deleted to playlist!");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getCustomVideos.invalidate({
        playlistId: data.playlistId,
      });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <div className="hidden md:flex flex-col gap-4">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size={"compact"}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};
