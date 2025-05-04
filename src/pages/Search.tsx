
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Manga, SearchFilters } from "@/types/manga";
import { searchManga } from "@/services/mangaService";
import MangaGrid from "@/components/manga/MangaGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search as SearchIcon, AlertCircle, BookX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Search = () => {
  const location = useLocation();
  
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  // Form state
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "ongoing" | "completed" | "hiatus">("all");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "alphabetical">("latest");
  
  // Available genres (in real app would be fetched)
  const availableGenres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", 
    "Supernatural", "Thriller", "Historical", "School", "Martial Arts",
    "Superhero", "Post-Apocalyptic", "Dark Fantasy"
  ];
  
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setQuery(queryParam);
      setSearched(true); // Mark as searched if there's a query param
    }
  }, [location.search]);
  
  // Perform search when form inputs change
  useEffect(() => {
    if (!searched) return; // Only search if a search has been initiated
    
    const performSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: SearchFilters = {
          query: query,
          status: status,
          genres: selectedGenres.length > 0 ? selectedGenres : undefined,
          sortBy: sortBy
        };
        
        const searchResults = await searchManga(filters);
        setResults(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        setError("Failed to fetch manga data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimeout = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [query, status, selectedGenres, sortBy, searched]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true); // Mark as searched when form is submitted
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Search Manga</h1>
      
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="flex gap-3">
          <div className="grow">
            <Input
              type="search"
              placeholder="Search by title or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-secondary/30 border-white/10"
            />
          </div>
          <Button type="submit" className="gap-2">
            <SearchIcon size={18} />
            Search
          </Button>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          {/* Status filter */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as any)}
            >
              <SelectTrigger className="bg-secondary/30 border-white/10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="hiatus">On Hiatus</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort filter */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <Select 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value as any)}
            >
              <SelectTrigger className="bg-secondary/30 border-white/10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Genres */}
        <div>
          <label className="block text-sm font-medium mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </form>
      
      <div className="pt-4">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-500/20 bg-red-950/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="text-red-500" size={20} />
              <p>{error}</p>
            </CardContent>
          </Card>
        ) : !searched ? (
          <Card className="border-white/5 bg-secondary/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Enter your search criteria</h3>
              <p className="text-muted-foreground">
                Use the search form above to find your favorite manga
              </p>
            </CardContent>
          </Card>
        ) : results.length === 0 ? (
          <Card className="border-white/5 bg-secondary/10">
            <CardContent className="p-8 text-center flex flex-col items-center gap-4">
              <BookX size={32} className="text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No manga found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse our featured manga
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Found {results.length} manga{results.length === 1 ? "" : "s"}
            </h2>
            <MangaGrid mangas={results} />
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
