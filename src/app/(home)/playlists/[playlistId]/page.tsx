import { DEFAULT_LIMIT } from "@/constants";
import { CustomVideosView } from "@/modules/playlists/ui/views/custom-videos-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  void trpc.playlists.getCustomVideos.prefetchInfinite({
    playlistId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.playlists.getOne.prefetch({
    id: playlistId,
  });

  return (
    <HydrateClient>
      <CustomVideosView playlistId={playlistId} />
    </HydrateClient>
  );
};
export default Page;
