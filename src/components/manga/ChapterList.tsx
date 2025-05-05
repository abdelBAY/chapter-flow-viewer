
import { Link } from "react-router-dom";
import { Chapter } from "@/types/manga";
import { formatDistanceToNow } from "date-fns";
import { Book, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  className?: string;
  limit?: number;
}

export const ChapterList = ({ chapters, mangaId, className, limit }: ChapterListProps) => {
  const displayedChapters = limit ? chapters.slice(0, limit) : chapters;

  const isNewChapter = (dateStr: string): boolean => {
    try {
      const chapterDate = new Date(dateStr);
      const now = new Date();
      // Consider chapters less than 3 days old as "new"
      const timeDiff = now.getTime() - chapterDate.getTime();
      return timeDiff < 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    } catch (error) {
      return false;
    }
  };

  const safeFormatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Unknown date";
      
      const now = new Date();
      const timeDiff = now.getTime() - date.getTime();
      
      // Format as "X days" if less than 30 days
      if (timeDiff < 30 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        return days === 0 ? "Today" : `${days} day${days > 1 ? 's' : ''}`;
      }
      
      return formatDistanceToNow(date, { addSuffix: false });
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
              
              {isNewChapter(chapter.createdAt) && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-[10px] h-4 bg-[#ea384c]">
                  <Flame className="h-3 w-3 mr-0.5" />
                  New
                </Badge>
              )}
              
              <span className="ml-auto text-xs text-white/50">
                {safeFormatDate(chapter.createdAt)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterList;
