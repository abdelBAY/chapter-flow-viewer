
import { useEffect, useState } from "react";
import { Manga } from "@/types/manga";
import { getMangaList } from "@/services/mangaService";
import MangaGrid from "@/components/manga/MangaGrid";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  const [latestMangas, setLatestMangas] = useState<Manga[]>([]);
  const [popularMangas, setPopularMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mangas = await getMangaList();
        
        // Sort by updated date for latest
        const latest = [...mangas].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        
        // For demo, just shuffle the array for "popular"
        const popular = [...mangas].sort(() => Math.random() - 0.5);
        
        setLatestMangas(latest);
        setPopularMangas(popular);
      } catch (error) {
        console.error("Failed to fetch manga:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gradient">Welcome to MangaReader</h1>
        <p className="text-muted-foreground mb-8">
          Discover and read your favorite manga series in one place
        </p>
      </section>
      
      <section>
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <MangaGrid mangas={latestMangas} title="Latest Updates" />
        )}
      </section>
      
      <section>
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <MangaGrid mangas={popularMangas} title="Popular Series" />
        )}
      </section>
    </div>
  );
};

export default HomePage;
