
import { Manga } from "@/types/manga";
import MangaCard from "./MangaCard";
import ChapterList from "./ChapterList";

interface MangaGridProps {
  mangas: Manga[];
  title?: string;
  showChapters?: boolean;
}

const MangaGrid = ({ mangas, title, showChapters = false }: MangaGridProps) => {
  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gradient">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mangas.map((manga) => (
          <div key={manga.id} className="flex flex-row gap-4">
            <div className="w-[180px] shrink-0">
              <MangaCard manga={manga} />
            </div>
            {showChapters && manga.recentChapters && (
              <ChapterList 
                chapters={manga.recentChapters}
                mangaId={manga.id}
                className="flex-1"
                limit={3}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MangaGrid;
