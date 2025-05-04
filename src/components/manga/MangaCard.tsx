
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MangaCardProps {
  manga: Manga;
  className?: string;
}

const MangaCard = ({ manga, className }: MangaCardProps) => {
  const statusColors = {
    ongoing: "bg-green-500/20 text-green-300 border-green-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    hiatus: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <Link 
      to={`/manga/${manga.id}`} 
      className={cn(
        "block w-full h-full relative group overflow-hidden rounded-md",
        className
      )}
    >
      <img
        src={manga.cover}
        alt={manga.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      
      {/* Status badge */}
      <div className="absolute top-2 right-2">
        <Badge 
          variant="outline" 
          className={cn("text-xs font-medium", statusColors[manga.status])}
        >
          {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
        </Badge>
      </div>
      
      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-medium text-sm line-clamp-2">
          {manga.title}
        </h3>
      </div>
    </Link>
  );
};

export default MangaCard;
