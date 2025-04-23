
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Manga, Chapter } from "@/types/manga";

interface ReaderHeaderProps {
  manga: Manga;
  chapter: Chapter;
}

export const ReaderHeader = ({ manga, chapter }: ReaderHeaderProps) => {
  return (
    <div className="fixed top-16 inset-x-0 z-30 bg-black/70 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto py-2 px-4 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Link 
            to={`/manga/${manga.id}`}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          
          <div className="text-sm">
            <h2 className="font-medium">{manga.title}</h2>
            <p className="text-xs text-muted-foreground">Chapter {chapter.number}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
