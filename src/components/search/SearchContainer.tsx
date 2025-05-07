
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import SearchForm from "@/components/search/SearchForm";
import FilterOptions from "@/components/search/FilterOptions";
import SearchResults from "@/components/search/SearchResults";

const SearchContainer: React.FC = () => {
  const location = useLocation();
  
  // Initialize search hook
  const { 
    results, 
    loading, 
    error, 
    searched, 
    query, 
    filters, 
    handleSearch, 
    handleFilterChange 
  } = useSearch();
  
  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      handleSearch(queryParam);
    }
  }, [location.search, handleSearch]);
  
  return (
    <div className="space-y-8">
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

export default SearchContainer;
