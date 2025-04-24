import { useEffect, useState } from "react";
import { Manga } from "@/types/manga";
import MangaGrid from "@/components/manga/MangaGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const mapSupabaseManga = (row: any): Manga => ({
  id: row.id,
  title: row.title,
  cover: row.cover_url,
  description: row.description || "",
  author: row.author,
  artist: row.artist,
  status: row.status,
  genres: [], // Genres are not fetched here
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  recentChapters: row.recent_chapters || [],
});

const HomePage = () => {
  const [latestMangas, setLatestMangas] = useState<Manga[]>([]);
  const [popularMangas, setPopularMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMangas = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("cms_mangas")
        .select(`
          *,
          recent_chapters:cms_chapters(
            id,
            number,
            title,
            created_at,
            pages
          )
        `)
        .order("updated_at", { ascending: false })
        .limit(6);

      if (error) {
        setIsLoading(false);
        return;
      }
      
      const mangas: Manga[] = (data || []).map(mapSupabaseManga);
      setLatestMangas(mangas);

      // "Popular Series": just shuffle for now
      const shuffled = [...mangas].sort(() => Math.random() - 0.5);
      setPopularMangas(shuffled);
      setIsLoading(false);
    };
    fetchMangas();
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
          <MangaGrid mangas={latestMangas} title="Latest Updates" showChapters />
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
