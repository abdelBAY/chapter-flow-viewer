
import { Manga } from "@/types/manga";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MangaCard from "@/components/manga/MangaCard";
import ChapterList from "@/components/manga/ChapterList";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LatestUpdatesSectionProps {
  mangas: Manga[];
  isLoading: boolean;
}

const LatestUpdatesSection = ({ mangas, isLoading }: LatestUpdatesSectionProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Latest Updates</h2>
        <Button variant="link" asChild className="text-manga-accent">
          <Link to="/search">View All</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mangas.map((manga) => (
          <div key={manga.id} className="group rounded-lg overflow-hidden border border-white/5 bg-black/20 hover:bg-black/30 transition-colors">
            <div className="aspect-[3/4] relative overflow-hidden">
              <MangaCard manga={manga} />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-white line-clamp-1">{manga.title}</h3>
              <ScrollArea className="h-16 mt-2">
                {manga.recentChapters && (
                  <ChapterList 
                    chapters={manga.recentChapters}
                    mangaId={manga.id}
                    limit={2}
                  />
                )}
              </ScrollArea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestUpdatesSection;
