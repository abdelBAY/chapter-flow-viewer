
import { useEffect, useState } from "react";
import { Manga } from "@/types/manga";
import MangaGrid from "@/components/manga/MangaGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import ChapterList from "@/components/manga/ChapterList";
import MangaCard from "@/components/manga/MangaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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
      try {
        // Fetch ALL manga with their recent chapters
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
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching manga:", error);
          setIsLoading(false);
          return;
        }
        
        const mangas: Manga[] = (data || []).map(mapSupabaseManga);
        // Get the most recent 6 manga for the latest updates section
        const recentMangas = mangas.slice(0, 6);
        setLatestMangas(recentMangas);

        // For popular series, use all manga but display them differently
        // Later this could be replaced with actual popularity metrics
        const shuffled = [...mangas].sort(() => Math.random() - 0.5);
        setPopularMangas(shuffled.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch manga:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMangas();
  }, []);

  // Featured manga section (top carousel)
  const renderFeaturedSection = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      );
    }

    // Use the first 3 popular manga for the featured section
    const featuredMangas = popularMangas.slice(0, 3);
    
    return (
      <Carousel
        className="mb-10"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {featuredMangas.map((manga) => (
            <CarouselItem key={manga.id} className="basis-full md:basis-1/3">
              <Link to={`/manga/${manga.id}`} className="block relative h-[280px] rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <img 
                  src={manga.cover} 
                  alt={manga.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg md:text-xl font-bold text-white line-clamp-2">{manga.title}</h3>
                  <p className="text-sm text-white/80">by {manga.author}</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white" />
      </Carousel>
    );
  };

  return (
    <div className="space-y-12 bg-[#121418] -mx-4 -my-6 p-4">
      {/* Featured manga carousel - larger cards at the top */}
      <section>
        {renderFeaturedSection()}
      </section>

      {/* Latest Updates Section */}
      <section>
        {isLoading ? (
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
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Latest Updates</h2>
              <Button variant="link" asChild className="text-manga-accent">
                <Link to="/search">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {latestMangas.map((manga) => (
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
        )}
      </section>

      {/* Popular Series Section */}
      <section className="pb-8">
        {isLoading ? (
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
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Popular Series</h2>
              <Button variant="link" asChild className="text-manga-accent">
                <Link to="/search">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularMangas.map((manga) => (
                <div key={manga.id} className="group rounded-lg overflow-hidden border border-white/5 bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <MangaCard manga={manga} />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white line-clamp-1">{manga.title}</h3>
                    <p className="text-sm text-white/60 mt-1">by {manga.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
