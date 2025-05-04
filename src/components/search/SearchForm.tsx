
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchFormProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

const SearchForm = ({ initialQuery, onSearch }: SearchFormProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
    </form>
  );
};

export default SearchForm;
