
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Chapter, Page, Manga } from "@/types/manga";
import { getChaptersByMangaId, getPagesByChapterId, getMangaById } from "@/services/mangaService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  List
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const Reader = () => {
  const { id: mangaId, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!mangaId || !chapterId) return;
      
      setLoading(true);
      try {
        const mangaData = await getMangaById(mangaId);
        setManga(mangaData || null);
        
        const chaptersData = await getChaptersByMangaId(mangaId);
        setChapters(chaptersData);
        
        const currentChapter = chaptersData.find(c => c.id === chapterId);
        setChapter(currentChapter || null);
        
        if (currentChapter) {
          const pagesData = await getPagesByChapterId(chapterId);
          setPages(pagesData);
        }
      } catch (error) {
        console.error("Failed to fetch chapter data:", error);
        toast.error("Failed to load chapter");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [mangaId, chapterId]);
  
  const nextPage = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Go to next chapter if available
      const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
      if (currentChapterIndex > 0) { // We're sorting from newest to oldest, so next is -1
        navigate(`/manga/${mangaId}/chapter/${chapters[currentChapterIndex - 1].id}`);
      } else {
        toast.info("You've reached the latest chapter");
      }
    }
  };
  
  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo(0, 0);
    } else {
      // Go to previous chapter if available
      const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
      if (currentChapterIndex < chapters.length - 1) { // Previous is +1
        navigate(`/manga/${mangaId}/chapter/${chapters[currentChapterIndex + 1].id}`);
      } else {
        toast.info("This is the first chapter");
      }
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
  
  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pages, currentIndex, chapterId]);
  
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
  
  const nextChapter = getNextChapter();
  const prevChapter = getPrevChapter();
  
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Reader Header */}
      <div className="fixed top-16 inset-x-0 z-30 bg-black/70 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto py-2 px-4 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link 
              to={`/manga/${mangaId}`}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <div className="text-sm">
              <h2 className="font-medium">{manga.title}</h2>
              <p className="text-xs text-muted-foreground">Chapter {chapter.number}</p>
            </div>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border-l border-white/10">
              <div className="space-y-4">
                <Link 
                  to={`/manga/${mangaId}`}
                  className="flex items-center gap-2 font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to {manga.title}
                </Link>
                
                <h3 className="text-lg font-semibold mt-4">Chapters</h3>
                <div className="h-[70vh] overflow-y-auto pr-4 space-y-2">
                  {chapters
                    .sort((a, b) => b.number - a.number)
                    .map((c) => (
                      <SheetClose key={c.id} asChild>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left ${c.id === chapter.id ? 'bg-secondary/50' : ''}`}
                          onClick={() => navigateToChapter(c.id)}
                        >
                          Chapter {c.number}
                        </Button>
                      </SheetClose>
                    ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Page Display */}
      <div 
        className="w-full max-w-3xl mt-20 mb-8 px-4"
        onClick={nextPage}
      >
        <img 
          src={pages[currentIndex]?.imageUrl} 
          alt={`Page ${pages[currentIndex]?.pageNumber}`}
          className="w-full h-auto object-contain select-none pointer-events-none"
        />
        
        {/* Page Counter */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Page {currentIndex + 1} of {pages.length}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="fixed bottom-4 inset-x-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between gap-4 backdrop-blur-md bg-black/40 rounded-full p-1 max-w-md mx-auto">
            {/* Previous Chapter */}
            <Button
              variant="ghost"
              size="icon"
              disabled={!prevChapter}
              onClick={() => prevChapter && navigateToChapter(prevChapter.id)}
              className="rounded-full"
            >
              <ChevronLeft size={20} />
            </Button>
            
            {/* Previous Page */}
            <Button
              variant="ghost"
              size="icon"
              disabled={currentIndex === 0 && !prevChapter}
              onClick={prevPage}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            
            {/* Page Indicator */}
            <div className="flex items-center text-xs px-2">
              {currentIndex + 1} / {pages.length}
            </div>
            
            {/* Next Page */}
            <Button
              variant="ghost"
              size="icon"
              disabled={currentIndex === pages.length - 1 && !nextChapter}
              onClick={nextPage}
              className="rounded-full"
            >
              <ArrowRight size={20} />
            </Button>
            
            {/* Next Chapter */}
            <Button
              variant="ghost"
              size="icon"
              disabled={!nextChapter}
              onClick={() => nextChapter && navigateToChapter(nextChapter.id)}
              className="rounded-full"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reader;
