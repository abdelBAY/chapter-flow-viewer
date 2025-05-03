
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bookmark, Menu, X, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo left side */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">Vagua Manga</span>
          </Link>

          {/* Center Logo */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <img 
                src="/lovable-uploads/e9b47105-c4e0-436a-890e-41c8c3e560fa.png" 
                alt="Vagua Manga Logo" 
                className="h-12 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative w-64 animate-in fade-in duration-200">
                <Input
                  type="search"
                  placeholder="Search manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary/50 border-white/10 pr-10"
                  autoFocus
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
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch}
                className="text-manga-accent"
              >
                <Search size={20} />
              </Button>
            )}
            <Link to="/favorites" className="flex items-center space-x-1 text-sm">
              <Bookmark size={18} className="text-manga-accent" />
              <span>Favorites</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-sm">
                <Shield size={18} className="text-manga-accent" />
                <span>Admin</span>
              </Link>
            )}
            {user ? (
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
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
            {/* Mobile center logo */}
            <div className="flex justify-center mb-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img 
                  src="/lovable-uploads/e9b47105-c4e0-436a-890e-41c8c3e560fa.png" 
                  alt="Vagua Manga Logo" 
                  className="h-12 w-auto" 
                />
              </Link>
            </div>
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  type="search"
                  placeholder="Search manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary/50 border-white/10 flex-1"
                  autoFocus
                />
                <Button type="submit" variant="ghost" size="icon">
                  <Search size={18} />
                </Button>
              </form>
            ) : (
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleSearch} 
                  className="text-manga-accent"
                >
                  <Search size={20} />
                </Button>
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <Link 
                to="/favorites"
                className="flex items-center py-2 px-3 rounded-md hover:bg-secondary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark size={18} className="mr-2 text-manga-accent" />
                Favorites
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-secondary/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield size={18} className="mr-2 text-manga-accent" />
                  Admin
                </Link>
              )}
              {user ? (
                <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
              ) : (
                <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
