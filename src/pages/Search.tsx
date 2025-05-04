
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Manga, SearchFilters } from "@/types/manga";
import { searchManga } from "@/services/mangaService";
import SearchForm from "@/components/search/SearchForm";
import FilterOptions, { FilterState } from "@/components/search/FilterOptions";
import SearchResults from "@/components/search/SearchResults";

const Search = () => {
  const location = useLocation();
  
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  // Form state
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    genres: [],
    sortBy: "latest"
  });
  
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
        const searchFilters: SearchFilters = {
          query: query,
          status: filters.status,
          genres: filters.genres.length > 0 ? filters.genres : undefined,
          sortBy: filters.sortBy
        };
        
        const searchResults = await searchManga(searchFilters);
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
  }, [query, filters.status, filters.genres, filters.sortBy, searched]);
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearched(true); // Mark as searched when form is submitted
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (searched) {
      // Only trigger search if user has already performed an initial search
      // This prevents filtering from triggering a search before user is ready
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Search Manga</h1>
      
      <SearchForm 
        initialQuery={query}
        onSearch={handleSearch}
      />
      
      <FilterOptions 
        initialFilters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="pt-4">
        <SearchResults 
          results={results}
          loading={loading}
          searched={searched}
          error={error}
        />
      </div>
    </div>
  );
};

export default Search;
