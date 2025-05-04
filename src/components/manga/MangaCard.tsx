
import { Link } from "react-router-dom";
import { Manga } from "@/types/manga";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MangaCardProps {
  manga: Manga;
  className?: string;
}

const MangaCard = ({ manga, className }: MangaCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const statusColors = {
    ongoing: "bg-green-500/20 text-green-300 border-green-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    hiatus: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link 
      to={`/manga/${manga.id}`} 
      className={cn(
        "block w-full h-full relative group overflow-hidden rounded-md",
        className
      )}
    >
      {!imageError ? (
        <img
          src={manga.cover}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
          <span className="text-sm font-medium px-3 py-2 text-center">{manga.title}</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      
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
