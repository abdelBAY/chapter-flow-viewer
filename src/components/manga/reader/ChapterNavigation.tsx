
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chapter } from "@/types/manga";

interface ChapterNavigationProps {
  currentChapter: Chapter;
  nextChapter: Chapter | null;
  prevChapter: Chapter | null;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  visible?: boolean;
}

export const ChapterNavigation = ({
  currentChapter,
  nextChapter,
  prevChapter,
  onNextChapter,
  onPrevChapter,
  visible = true
}: ChapterNavigationProps) => {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 inset-x-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between gap-4 backdrop-blur-md bg-black/40 rounded-full p-1 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="icon"
            disabled={!prevChapter}
            onClick={onPrevChapter}
            className="rounded-full"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <div className="flex items-center text-xs px-2">
            Chapter {currentChapter.number}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            disabled={!nextChapter}
            onClick={onNextChapter}
            className="rounded-full"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
