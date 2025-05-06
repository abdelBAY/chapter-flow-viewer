import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  adaptMangaFromDB, 
  adaptChapterFromDB, 
  adaptPageFromDB,
  MangaFromDB,
  ChapterFromDB,
  PageFromDB
} from "@/types/manga";
import { ReaderHeader } from "@/components/manga/reader/ReaderHeader";
import { ChapterSidebar } from "@/components/manga/reader/ChapterSidebar";
import { PageDisplay } from "@/components/manga/reader/PageDisplay";
import { ChapterNavigation } from "@/components/manga/reader/ChapterNavigation";
import { ChevronUp } from "lucide-react";

const Reader = () => {
  const { id: mangaId, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const [readingMode, setReadingMode] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  
  // Fetch manga data
  const { data: manga, isLoading: loadingManga } = useQuery({
    queryKey: ["manga-details", mangaId],
    queryFn: async () => {
      if (!mangaId) return null;
      const { data, error } = await supabase
        .from("cms_mangas")
        .select("*")
        .eq("id", mangaId)
        .single();
      
      if (error) throw error;
      
      // Get manga genres
      const { data: genresData, error: genresError } = await supabase
        .from("cms_manga_genres")
        .select("cms_genres(name)")
        .eq("manga_id", mangaId);
        
      const genres = genresError ? [] : genresData?.map(g => g.cms_genres?.name).filter(Boolean) as string[];
      
      return adaptMangaFromDB(data as MangaFromDB, genres);
    },
    enabled: !!mangaId
  });

  // Fetch chapters for this manga
  const { data: chapters = [] } = useQuery({
    queryKey: ["manga-chapters", mangaId],
    queryFn: async () => {
      if (!mangaId) return [];
      const { data, error } = await supabase
        .from("cms_chapters")
        .select("*")
        .eq("manga_id", mangaId)
        .order("number", { ascending: false });
      
      if (error) throw error;
      return (data as ChapterFromDB[]).map(adaptChapterFromDB);
    },
    enabled: !!mangaId
  });

  // Fetch current chapter
  const { data: chapter, isLoading: loadingChapter } = useQuery({
    queryKey: ["chapter-detail", chapterId],
    queryFn: async () => {
      if (!chapterId) return null;
      const { data, error } = await supabase
        .from("cms_chapters")
        .select("*")
        .eq("id", chapterId)
        .single();
      
      if (error) throw error;
      return adaptChapterFromDB(data as ChapterFromDB);
    },
    enabled: !!chapterId
  });

  // Fetch pages for current chapter
  const { data: pages = [], isLoading: loadingPages } = useQuery({
    queryKey: ["chapter-pages", chapterId],
    queryFn: async () => {
      if (!chapterId) return [];
      const { data, error } = await supabase
        .from("cms_pages")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("page_number");
      
      if (error) throw error;
      return (data as PageFromDB[]).map(adaptPageFromDB);
    },
    enabled: !!chapterId
  });
  
  
  const loading = loadingManga || loadingChapter || loadingPages;
  
  const nextChapter = () => {
    const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
    if (currentChapterIndex > 0) {
      navigate(`/manga/${mangaId}/chapter/${chapters[currentChapterIndex - 1].id}`);
    } else {
      toast.info("You've reached the latest chapter");
    }
  };
  
  const prevChapter = () => {
    const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
    if (currentChapterIndex < chapters.length - 1) {
      navigate(`/manga/${mangaId}/chapter/${chapters[currentChapterIndex + 1].id}`);
    } else {
      toast.info("This is the first chapter");
    }
  };
  
  const navigateToChapter = (targetChapterId: string) => {
    navigate(`/manga/${mangaId}/chapter/${targetChapterId}`);
  };
  
  const getNextChapter = () => {
    const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
    return currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  };
  
  const getPrevChapter = () => {
    const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
    return currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;
  };
  
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleReadingMode = () => {
    setReadingMode(!readingMode);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-full max-w-3xl">
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-[70vh] w-full" />
          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!manga || !chapter || pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Chapter not found or has no pages</p>
        <Button asChild variant="default">
          <Link to={`/manga/${mangaId}`}>Back to Manga</Link>
        </Button>
      </div>
    );
  }
  
  const nextChapterData = getNextChapter();
  const prevChapterData = getPrevChapter();
  
  return (
    <div 
      className="flex flex-col items-center min-h-screen"
      onClick={toggleReadingMode}
    >
      <div ref={topRef} />
      <ReaderHeader 
        manga={manga} 
        chapter={chapter} 
        visible={!readingMode}
      />
      
      <div className="w-full max-w-3xl mt-20 mb-8 px-4">
        <PageDisplay pages={pages} />
      </div>
      
      <ChapterNavigation
        currentChapter={chapter}
        nextChapter={nextChapterData}
        prevChapter={prevChapterData}
        onNextChapter={nextChapter}
        onPrevChapter={prevChapter}
        visible={!readingMode}
      />
      
      {!readingMode && (
        <div className="fixed top-16 right-4 z-30">
          <ChapterSidebar
            manga={manga}
            chapters={chapters}
            currentChapter={chapter}
            onChapterSelect={navigateToChapter}
          />
        </div>
      )}
      
      {/* Back to top button */}
      <Button
        variant="secondary"
        size="icon"
        className={`fixed bottom-4 left-4 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity ${readingMode ? 'opacity-30' : 'opacity-70'}`}
        onClick={(e) => {
          e.stopPropagation();
          scrollToTop();
        }}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Reader;
