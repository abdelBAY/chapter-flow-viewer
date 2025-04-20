
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
      <div className="space-y-3">
        {chapters.length === 0 ? (
          <p className="text-muted-foreground">No chapters available.</p>
        ) : (
          chapters.map((chapter) => (
            <Card key={chapter.id} className="bg-secondary/30 hover:bg-secondary/40 transition-colors">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">
                    Chapter {chapter.number}
                    {chapter.title !== `Chapter ${chapter.number}` && `: ${chapter.title}`}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true })}
                    {" · "}
                    {chapter.pages} pages
                  </p>
                </div>
                <Button 
                  variant="outline" 
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
