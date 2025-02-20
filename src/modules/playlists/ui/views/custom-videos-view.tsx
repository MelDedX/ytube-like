import { CustomVideosSection } from "../sections/custom-videos-section";
import { PlaylistHeaderSection } from "../sections/playlist-header-section";

interface CustomVideosViewProps {
  playlistId: string;
}

export const CustomVideosView = ({ playlistId }: CustomVideosViewProps) => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <CustomVideosSection playlistId={playlistId} />
    </div>
  );
};
