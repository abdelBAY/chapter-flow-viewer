
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
      <div className="space-y-2">
        {chapters.length === 0 ? (
          <p className="text-muted-foreground text-sm">No chapters available.</p>
        ) : (
          displayedChapters.map((chapter) => (
            <Card 
              key={chapter.id} 
              className="bg-secondary/10 hover:bg-secondary/20 transition-colors"
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="bg-white text-black rounded px-3 py-1 font-bold text-sm">
                  {chapter.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {chapter.title !== `Chapter ${chapter.number}` && chapter.title}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {safeFormatDate(chapter.createdAt)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="ml-auto p-0 h-8 w-8"
                >
                  <Link to={`/manga/${mangaId}/chapter/${chapter.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterList;
