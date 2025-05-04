
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface FilterState {
  status: "all" | "ongoing" | "completed" | "hiatus";
  genres: string[];
  sortBy: "latest" | "oldest" | "alphabetical";
}

interface FilterOptionsProps {
  initialFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterOptions = ({ initialFilters, onFilterChange }: FilterOptionsProps) => {
  const [status, setStatus] = useState<"all" | "ongoing" | "completed" | "hiatus">(initialFilters.status);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialFilters.genres);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "alphabetical">(initialFilters.sortBy);

  // Available genres (in real app would be fetched)
  const availableGenres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", 
    "Supernatural", "Thriller", "Historical", "School", "Martial Arts",
    "Superhero", "Post-Apocalyptic", "Dark Fantasy"
  ];

  const toggleGenre = (genre: string) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(updatedGenres);
    onFilterChange({ status, genres: updatedGenres, sortBy });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value as "all" | "ongoing" | "completed" | "hiatus";
    setStatus(newStatus);
    onFilterChange({ status: newStatus, genres: selectedGenres, sortBy });
  };

  const handleSortChange = (value: string) => {
    const newSortBy = value as "latest" | "oldest" | "alphabetical";
    setSortBy(newSortBy);
    onFilterChange({ status, genres: selectedGenres, sortBy: newSortBy });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Status filter */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select 
            value={status} 
            onValueChange={handleStatusChange}
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
            onValueChange={handleSortChange}
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
    </div>
  );
};

export default FilterOptions;
