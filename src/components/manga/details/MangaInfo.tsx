
import { Manga } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Bookmark } from "lucide-react";

interface MangaInfoProps {
  manga: Manga;
  favorited: boolean;
  onFavoriteToggle: () => Promise<void>;
  hasChapters: boolean;
  firstChapterId?: string;
  mangaId: string;
}

const MangaInfo = ({ 
  manga, 
  favorited, 
  onFavoriteToggle, 
  hasChapters, 
  firstChapterId,
  mangaId 
}: MangaInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64 shrink-0">
        {manga.cover ? (
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-auto rounded-lg object-cover shadow-md"
          />
        ) : (
          <div className="w-full h-96 flex items-center justify-center bg-muted/40 rounded-lg">
            <span className="text-muted-foreground">No Cover</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-3">{manga.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {manga.genres.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className={
              manga.status === "ongoing"
                ? "text-green-300 border-green-500/30"
                : manga.status === "completed"
                ? "text-blue-300 border-blue-500/30"
                : "text-amber-300 border-amber-500/30"
            }
          >
            {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
          </Badge>
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Author:</span> {manga.author}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Artist:</span> {manga.artist}
          </p>
        </div>
        <p className="text-sm mb-6">{manga.description}</p>
        <div className="flex gap-4">
          <Button
            variant={favorited ? "secondary" : "default"}
            onClick={onFavoriteToggle}
            className="gap-2"
          >
            {favorited ? (
              <>
                <BookmarkCheck size={18} />
                In Favorites
              </>
            ) : (
              <>
                <Bookmark size={18} />
                Add to Favorites
              </>
            )}
          </Button>
          {hasChapters && (
            <Button
              asChild
              variant="outline"
              className="hover:bg-manga-accent hover:text-white"
            >
              <a href={`/manga/${mangaId}/chapter/${firstChapterId}`}>
                Read First Chapter
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaInfo;
