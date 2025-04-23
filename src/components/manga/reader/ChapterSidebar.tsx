
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { List, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Chapter, Manga } from "@/types/manga";

interface ChapterSidebarProps {
  manga: Manga;
  chapters: Chapter[];
  currentChapter: Chapter;
  onChapterSelect: (chapterId: string) => void;
}

export const ChapterSidebar = ({ 
  manga, 
  chapters, 
  currentChapter, 
  onChapterSelect 
}: ChapterSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <List size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-background border-l border-white/10">
        <div className="space-y-4">
          <Link 
            to={`/manga/${manga.id}`}
            className="flex items-center gap-2 font-medium"
          >
            <ArrowLeft size={16} />
            Back to {manga.title}
          </Link>
          
          <h3 className="text-lg font-semibold mt-4">Chapters</h3>
          <div className="h-[70vh] overflow-y-auto pr-4 space-y-2">
            {chapters
              .sort((a, b) => b.number - a.number)
              .map((c) => (
                <SheetClose key={c.id} asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${c.id === currentChapter.id ? 'bg-secondary/50' : ''}`}
                    onClick={() => onChapterSelect(c.id)}
                  >
                    Chapter {c.number}
                  </Button>
                </SheetClose>
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
