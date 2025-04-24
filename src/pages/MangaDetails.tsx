
import { useParams } from "react-router-dom";
import ChapterList from "@/components/manga/ChapterList";
import MangaInfo from "@/components/manga/details/MangaInfo";
import MangaDetailsLoading from "@/components/manga/details/MangaDetailsLoading";
import { useMangaDetails } from "@/hooks/useMangaDetails";

const MangaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { manga, chapters, loading, favorited, handleFavoriteToggle } = useMangaDetails(id!);

  if (loading) {
    return <MangaDetailsLoading />;
  }

  if (!manga) {
    return <div className="text-center py-12">Manga not found</div>;
  }

  return (
    <div className="space-y-8">
      <MangaInfo
        manga={manga}
        favorited={favorited}
        onFavoriteToggle={handleFavoriteToggle}
        hasChapters={chapters.length > 0}
        firstChapterId={chapters[0]?.id}
        mangaId={manga.id}
      />
      <ChapterList
        chapters={chapters.sort((a, b) => b.number - a.number)}
        mangaId={manga.id}
        className="mt-8"
      />
    </div>
  );
};

export default MangaDetails;
