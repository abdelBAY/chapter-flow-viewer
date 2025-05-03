
import { Link } from "react-router-dom";
import { Chapter } from "@/types/manga";
import { formatDistanceToNow } from "date-fns";
import { Book, Clock } from "lucide-react";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  className?: string;
  limit?: number;
}

export const ChapterList = ({ chapters, mangaId, className, limit }: ChapterListProps) => {
  const displayedChapters = limit ? chapters.slice(0, limit) : chapters;

  const safeFormatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Unknown date";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className={className}>
      <div className="space-y-1.5">
        {chapters.length === 0 ? (
          <p className="text-white/50 text-sm">No chapters available.</p>
        ) : (
          displayedChapters.map((chapter) => (
            <Link 
              key={chapter.id}
              to={`/manga/${mangaId}/chapter/${chapter.id}`}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-manga-accent transition-colors p-1 rounded hover:bg-white/5"
            >
              <Book className="h-3.5 w-3.5 text-manga-accent" />
              <span className="font-medium">Chapter {chapter.number}</span>
              <Clock className="h-3.5 w-3.5 ml-auto text-white/50" />
              <span className="text-xs text-white/50">{safeFormatDate(chapter.createdAt)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterList;
