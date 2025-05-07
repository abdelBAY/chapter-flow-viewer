
import { useEffect, useState } from "react";
import { Manga } from "@/types/manga";
import { supabase } from "@/integrations/supabase/client";

interface MangaDataState {
  latestMangas: Manga[];
  popularMangas: Manga[];
  isLoading: boolean;
}

export const mapSupabaseManga = (row: any): Manga => ({
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

export const useFetchMangas = (): MangaDataState => {
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

  return { latestMangas, popularMangas, isLoading };
};
