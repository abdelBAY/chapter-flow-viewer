
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Manga, SearchFilters } from "@/types/manga";
import { searchManga, getMangaList } from "@/services/mangaService";
import SearchForm from "@/components/search/SearchForm";
import FilterOptions, { FilterState } from "@/components/search/FilterOptions";
import SearchResults from "@/components/search/SearchResults";

const Search = () => {
  const location = useLocation();
  
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading to fetch all manga
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  // Form state
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    genres: [],
    sortBy: "latest"
  });
  
  // Load all manga on component mount
  useEffect(() => {
    const loadAllManga = async () => {
      try {
        const allManga = await getMangaList();
        setResults(allManga);
      } catch (error) {
        console.error("Failed to load manga:", error);
        setError("Failed to load manga. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAllManga();
  }, []);
  
  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setQuery(queryParam);
      setSearched(true); // Mark as searched if there's a query param
      // Trigger search immediately if query param exists
      performSearch(queryParam, filters);
    }
  }, [location.search]);
  
  // Perform search function
  const performSearch = async (searchQuery: string, searchFilters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Performing search with query:", searchQuery);
      
      const filters: SearchFilters = {
        query: searchQuery,
        status: searchFilters.status === "all" ? undefined : searchFilters.status,
        genres: searchFilters.genres.length > 0 ? searchFilters.genres : undefined,
        sortBy: searchFilters.sortBy
      };
      
      console.log("Search filters:", filters);
      const searchResults = await searchManga(filters);
      console.log("Search results:", searchResults);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch manga data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Perform search when filters change (only if already searched)
  useEffect(() => {
    if (searched) {
      performSearch(query, filters);
    }
  }, [filters.status, filters.sortBy, searched]);
  
  // Debounced search for genres changes
  useEffect(() => {
    if (!searched) return;
    
    const debounceTimeout = setTimeout(() => {
      performSearch(query, filters);
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [filters.genres]);
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearched(true); 
    performSearch(newQuery, filters);
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Search will be triggered by the effect watching filters
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
