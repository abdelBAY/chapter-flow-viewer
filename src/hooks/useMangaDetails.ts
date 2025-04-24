
import { useState, useEffect } from "react";
import { Manga, Chapter } from "@/types/manga";
import { supabase } from "@/integrations/supabase/client";
import { getMangaById, getChaptersByMangaId, isFavorite, addFavorite, removeFavorite } from "@/services/mangaService";
import { toast } from "sonner";

export const useMangaDetails = (id: string) => {
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);

      const { data: sbManga, error: mangaError } = await supabase
        .from("cms_mangas")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (sbManga && !mangaError) {
        setFromSupabase(true);
        const { data: genreRows } = await supabase
          .from("cms_manga_genres")
          .select("genre_id, cms_genres(id, name)")
          .eq("manga_id", id);
        const genres = genreRows
          ? genreRows.flatMap((row: any) => row.cms_genres?.name ? [row.cms_genres.name] : [])
          : [];

        setManga({
          id: sbManga.id,
          title: sbManga.title,
          cover: sbManga.cover_url || "",
          description: sbManga.description || "",
          author: sbManga.author || "",
          artist: sbManga.artist || "",
          status: sbManga.status,
          genres: genres,
          createdAt: sbManga.created_at,
          updatedAt: sbManga.updated_at,
        });

        const { data: sbChapters } = await supabase
          .from("cms_chapters")
          .select("*")
          .eq("manga_id", id)
          .order("number", { ascending: false });

        if (sbChapters) {
          setChapters(
            sbChapters.map((ch: any) => ({
              id: ch.id,
              mangaId: ch.manga_id,
              number: ch.number,
              title: ch.title,
              createdAt: ch.created_at,
              pages: ch.pages,
            }))
          );
        }

        const isFav = await isFavorite(id);
        setFavorited(isFav);
        setLoading(false);
        return;
      }

      try {
        const mangaData = await getMangaById(id);
        if (!mangaData) {
          toast.error("Manga not found");
          setManga(null);
          setChapters([]);
          setLoading(false);
          return;
        }

        setManga(mangaData);
        const chaptersData = await getChaptersByMangaId(id);
        setChapters(chaptersData);
        const isFav = await isFavorite(id);
        setFavorited(isFav);
      } catch (error) {
        console.error("Failed to fetch manga details:", error);
        toast.error("Failed to load manga details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!manga) return;
    try {
      if (favorited) {
        await removeFavorite(manga.id);
        setFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await addFavorite(manga.id);
        setFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  return {
    manga,
    chapters,
    loading,
    favorited,
    handleFavoriteToggle
  };
};
