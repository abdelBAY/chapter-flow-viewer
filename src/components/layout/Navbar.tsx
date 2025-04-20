
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bookmark, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">MangaReader</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="search"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary/50 border-white/10 pr-10"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Search size={18} />
              </Button>
            </form>
            <Link to="/favorites" className="flex items-center space-x-1 text-sm">
              <Bookmark size={18} className="text-manga-accent" />
              <span>Favorites</span>
            </Link>
            <Button variant="outline" size="sm">Sign In</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                type="search"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary/50 border-white/10"
              />
              <Button type="submit" variant="ghost" size="icon">
                <Search size={18} />
              </Button>
            </form>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/favorites"
                className="flex items-center py-2 px-3 rounded-md hover:bg-secondary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark size={18} className="mr-2 text-manga-accent" />
                Favorites
              </Link>
              <Button variant="outline" className="w-full">Sign In</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
