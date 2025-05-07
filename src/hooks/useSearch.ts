import { useState, useEffect } from "react";
import { Manga } from "@/types/manga";
import { supabase } from "@/integrations/supabase/client";
import { FilterState } from "@/components/search/FilterOptions";
import { searchManga } from "@/services/searchService";

export const useSearch = (initialQuery: string = "") => {
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    genres: [],
    sortBy: "latest"
  });

  // Map Supabase manga data to our Manga type
  const mapSupabaseManga = (row: any): Manga => ({
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
  
  // Load all manga from Supabase on component mount
  useEffect(() => {
    const loadAllManga = async () => {
      try {
        const { data, error: supabaseError } = await supabase
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
          
        if (supabaseError) {
          console.error("Error fetching manga:", supabaseError);
          setError("Failed to load manga. Please refresh the page.");
          setLoading(false);
          return;
        }
        
        const mangas: Manga[] = (data || []).map(mapSupabaseManga);
        setResults(mangas);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load manga:", error);
        setError("Failed to load manga. Please refresh the page.");
        setLoading(false);
      }
    };
    
    loadAllManga();
  }, []);

  // Perform search function
  const performSearch = async (searchQuery: string, searchFilters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      // Try to use Supabase search first
      let results: Manga[] = [];
      
      // If using Supabase search fails or returns no results, fall back to client-side search
      if (results.length === 0) {
        const filters = {
          query: searchQuery,
          genres: searchFilters.genres,
          status: searchFilters.status,
          sortBy: searchFilters.sortBy
        };
        
        results = await searchManga(filters);
      }
      
      setResults(results);
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

  return {
    results,
    loading,
    error,
    searched,
    query,
    filters,
    handleSearch,
    handleFilterChange,
  };
};
