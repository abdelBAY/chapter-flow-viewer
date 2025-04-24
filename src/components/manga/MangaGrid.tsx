
import { Manga } from "@/types/manga";
import MangaCard from "./MangaCard";
import ChapterList from "./ChapterList";
import { Badge } from "@/components/ui/badge";

interface MangaGridProps {
  mangas: Manga[];
  title?: string;
  showChapters?: boolean;
}

const MangaGrid = ({ mangas, title, showChapters = false }: MangaGridProps) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-black text-white border-none px-2 py-1 uppercase text-xs font-bold">
            New
          </Badge>
          <h2 className="text-2xl font-bold text-gradient">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mangas.map((manga) => (
          <div key={manga.id} className="group">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg mb-3">
              <MangaCard manga={manga} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                {manga.title}
              </h3>
              {showChapters && manga.recentChapters && (
                <ChapterList 
                  chapters={manga.recentChapters}
                  mangaId={manga.id}
                  limit={2}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MangaGrid;
