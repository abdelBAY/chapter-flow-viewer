
import { Link } from "react-router-dom";
import { Chapter } from "@/types/manga";
import { Book, Calendar, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isRecentDate, formatDate } from "@/utils/dateUtils";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  className?: string;
  limit?: number;
}

export const ChapterList = ({
  chapters,
  mangaId,
  className,
  limit
}: ChapterListProps) => {
  // Sort chapters by number in descending order (highest chapter number first)
  const sortedChapters = [...chapters].sort((a, b) => b.number - a.number);

  // Apply limit after sorting if specified
  const displayedChapters = limit ? sortedChapters.slice(0, limit) : sortedChapters;

  // Find the latest chapter based on chapter number
  const latestChapterId = chapters.length > 0 
    ? chapters.reduce((latest, current) => current.number > latest.number ? current : latest, chapters[0]).id
    : null;
  
  return (
    <div className={className}>
      <div className="space-y-1.5">
        {chapters.length === 0 ? (
          <p className="text-white/50 text-sm">No chapters available.</p>
        ) : (
          displayedChapters.map(chapter => (
            <Link 
              key={chapter.id} 
              to={`/manga/${mangaId}/chapter/${chapter.id}`} 
              className={`flex items-center gap-2 text-sm ${chapter.id === latestChapterId ? "text-white font-medium bg-white/10" : "text-white/70"} hover:text-manga-accent transition-colors p-1 rounded hover:bg-white/5`}
            >
              <Book className={`h-3.5 w-3.5 ${chapter.id === latestChapterId ? "text-manga-accent" : "text-manga-accent"}`} />
              <span className="font-medium">Chapter {chapter.number}</span>
              
              {isRecentDate(chapter.createdAt) && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-[10px] h-4 bg-[#ea384c] flex items-center">
                  <Flame className="h-3 w-3 mr-0.5" />
                  New
                </Badge>
              )}
              
              {chapter.id === latestChapterId && !isRecentDate(chapter.createdAt)}
              
              <span className="ml-auto text-xs flex items-center gap-1 text-white/60">
                <Calendar className="h-3 w-3" />
                {formatDate(chapter.createdAt)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterList;
