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
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-manga-accent/20 to-manga-dark/40 p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Welcome to Vagua Manga
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
            Discover and read your favorite manga series all in one place. From action-packed adventures to heartwarming stories.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/lovable-uploads/1204832b-b2db-4e6a-8548-0a23ce974c8f.png')] opacity-10 bg-cover bg-center" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-manga-accent/10 to-transparent" />
      </section>

      {/* Latest Updates Section */}
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

      {/* Popular Series Section */}
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
