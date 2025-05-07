
import { useState, useEffect } from "react";
import { getFavorites } from "@/services/favoritesService";
import { Manga } from "@/types/manga";
import MangaGrid from "@/components/manga/MangaGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const favoritesData = await getFavorites();
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-6" />
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
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="py-12 text-center">
          <BookmarkX size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Add manga to your favorites to see them here
          </p>
          <Button asChild variant="default">
            <Link to="/">Browse Manga</Link>
          </Button>
        </div>
      ) : (
        <MangaGrid mangas={favorites} />
      )}
    </div>
  );
};

export default Favorites;
