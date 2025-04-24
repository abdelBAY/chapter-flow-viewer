
import { Link } from "react-router-dom";
import { Chapter } from "@/types/manga";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  className?: string;
  limit?: number;
}

export const ChapterList = ({ chapters, mangaId, className, limit }: ChapterListProps) => {
  const displayedChapters = limit ? chapters.slice(0, limit) : chapters;

  // Helper function to safely format date
  const safeFormatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Invalid date format:", dateStr, error);
      return "Unknown date";
    }
  };

  return (
    <div className={className}>
      <div className="space-y-1.5">
        {chapters.length === 0 ? (
          <p className="text-muted-foreground text-sm">No chapters available.</p>
        ) : (
          displayedChapters.map((chapter) => (
            <Link 
              key={chapter.id}
              to={`/manga/${mangaId}/chapter/${chapter.id}`}
              className="block"
            >
              <Card className="bg-secondary/10 hover:bg-secondary/20 transition-colors">
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Ch. {chapter.number}
                      </span>
                      {chapter.title !== `Chapter ${chapter.number}` && (
                        <span className="text-xs text-muted-foreground truncate">
                          {chapter.title}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {safeFormatDate(chapter.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterList;
