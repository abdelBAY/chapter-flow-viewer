
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MangaCardProps {
  manga: Manga;
  className?: string;
}

const MangaCard = ({ manga, className }: MangaCardProps) => {
  // Function to display only a subset of genres to prevent overcrowding
  const displayGenres = (genres: string[]) => {
    if (genres.length <= 2) return genres;
    return [...genres.slice(0, 2), `+${genres.length - 2}`];
  };

  const statusColors = {
    ongoing: "bg-green-500/20 text-green-300 border-green-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    hiatus: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <Link to={`/manga/${manga.id}`} className={cn("group", className)}>
      <div className="relative overflow-hidden rounded-lg bg-black/40 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={manga.cover}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs font-medium", statusColors[manga.status])}
            >
              {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
            </Badge>
          </div>
          
          {/* Genre tags */}
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {displayGenres(manga.genres).map((genre, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-black/60 backdrop-blur-sm"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium line-clamp-1 group-hover:text-manga-accent transition-colors">
            {manga.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {manga.author}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
