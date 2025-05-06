
import { Manga } from "@/types/manga";
import MangaGrid from "@/components/manga/MangaGrid";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookX, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
  results: Manga[];
  loading: boolean;
  searched: boolean;
  error: string | null;
}

const SearchResults = ({ results, loading, searched, error }: SearchResultsProps) => {
  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-950/10">
        <CardContent className="flex items-center gap-3 p-4">
          <AlertCircle className="text-red-500" size={20} />
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!searched) {
    return (
      <Card className="border-white/5 bg-secondary/10">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Enter your search criteria</h3>
          <p className="text-muted-foreground">
            Use the search form above to find your favorite manga
          </p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Found {results.length} manga{results.length === 1 ? "" : "s"}
      </h2>
      <MangaGrid mangas={results} />
    </>
  );
};

export default SearchResults;
