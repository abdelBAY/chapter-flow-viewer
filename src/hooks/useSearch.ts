
import { useState, useEffect } from "react";
import { Manga } from "@/types/manga";
import { supabase } from "@/integrations/supabase/client";
import { FilterState } from "@/components/search/FilterOptions";

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

  // Perform search function using Supabase
  const performSearch = async (searchQuery: string, searchFilters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Performing search with query:", searchQuery);
      
      // Start building the query
      let query = supabase
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
        `);
      
      // Add text search if query is provided
      if (searchQuery && searchQuery.trim() !== '') {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      // Add status filter if it's not 'all'
      if (searchFilters.status !== 'all') {
        query = query.eq('status', searchFilters.status);
      }
      
      // Add sorting
      switch (searchFilters.sortBy) {
        case 'latest':
          query = query.order('updated_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'alphabetical':
          query = query.order('title', { ascending: true });
          break;
      }
      
      const { data, error: supabaseError } = await query;
      
      if (supabaseError) {
        console.error("Search failed:", supabaseError);
        setError("Failed to fetch manga data. Please try again.");
        setLoading(false);
        return;
      }
      
      const mangas: Manga[] = (data || []).map(mapSupabaseManga);
      console.log("Search results:", mangas);
      setResults(mangas);
      setLoading(false);
      
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch manga data. Please try again.");
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
