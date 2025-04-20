
import { Manga } from "@/types/manga";
import MangaCard from "./MangaCard";

interface MangaGridProps {
  mangas: Manga[];
  title?: string;
}

const MangaGrid = ({ mangas, title }: MangaGridProps) => {
  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gradient">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </div>
  );
};

export default MangaGrid;
