
import { Link } from "react-router-dom";
import { Chapter } from "@/types/manga";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  className?: string;
}

const ChapterList = ({ chapters, mangaId, className }: ChapterListProps) => {
  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4">Chapters</h3>
      <div className="space-y-2">
        {chapters.length === 0 ? (
          <p className="text-muted-foreground">No chapters available.</p>
        ) : (
          chapters.map((chapter) => (
            <Card 
              key={chapter.id} 
              className="bg-secondary/20 hover:bg-secondary/30 transition-colors flex items-center border-0"
            >
              <div className="bg-white/90 text-black min-w-[3rem] h-full flex items-center justify-center py-4 rounded-l-lg font-bold text-lg">
                {chapter.number}
              </div>
              <CardContent className="p-4 flex-1 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">
                    {chapter.title !== `Chapter ${chapter.number}` && chapter.title}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    {formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true })}
                    <span className="inline-block w-1 h-1 bg-muted-foreground rounded-full" />
                    {chapter.pages} pages
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="hover:bg-manga-accent hover:text-white"
                >
                  <Link to={`/manga/${mangaId}/chapter/${chapter.id}`}>
                    Read
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
