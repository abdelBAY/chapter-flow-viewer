
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Manga, Chapter } from "@/types/manga";
import { getMangaById, getChaptersByMangaId, addFavorite, removeFavorite, isFavorite } from "@/services/mangaService";
import ChapterList from "@/components/manga/ChapterList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, BookmarkCheck, BookmarkX } from "lucide-react";
import { toast } from "sonner";

const MangaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const mangaData = await getMangaById(id);
        if (!mangaData) {
          toast.error("Manga not found");
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-96 w-64 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-7 w-20" />
              ))}
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-40 mt-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!manga) {
    return <div className="text-center py-12">Manga not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover Image */}
        <div className="w-full md:w-64 shrink-0">
          <img 
            src={manga.cover} 
            alt={manga.title} 
            className="w-full h-auto rounded-lg object-cover shadow-md"
          />
        </div>
        
        {/* Manga Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3">{manga.title}</h1>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {manga.genres.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
            <Badge 
              variant="outline" 
              className={
                manga.status === "ongoing" ? "text-green-300 border-green-500/30" :
                manga.status === "completed" ? "text-blue-300 border-blue-500/30" :
                "text-amber-300 border-amber-500/30"
              }
            >
              {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
            </Badge>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Author:</span> {manga.author}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Artist:</span> {manga.artist}
            </p>
          </div>
          
          {/* Description */}
          <p className="text-sm mb-6">{manga.description}</p>
          
          {/* Action buttons */}
          <div className="flex gap-4">
            <Button 
              variant={favorited ? "secondary" : "default"}
              onClick={handleFavoriteToggle}
              className="gap-2"
            >
              {favorited ? (
                <>
                  <BookmarkCheck size={18} />
                  In Favorites
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  Add to Favorites
                </>
              )}
            </Button>
            
            {chapters.length > 0 && (
              <Button 
                asChild
                variant="outline"
                className="hover:bg-manga-accent hover:text-white"
              >
                <a href={`/manga/${manga.id}/chapter/${chapters[0].id}`}>
                  Read First Chapter
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Chapters List */}
      <ChapterList 
        chapters={chapters.sort((a, b) => b.number - a.number)} 
        mangaId={manga.id} 
        className="mt-8" 
      />
    </div>
  );
};

export default MangaDetails;
