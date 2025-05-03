
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-bold text-gradient">Vagua Manga</Link>
            <p className="text-sm text-muted-foreground mt-1">Read your favorite manga online</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/" className="hover:text-manga-accent transition-colors">Home</Link>
            <Link to="/search" className="hover:text-manga-accent transition-colors">Browse</Link>
            <Link to="/favorites" className="hover:text-manga-accent transition-colors">Favorites</Link>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Vagua Manga. All rights reserved.</p>
          <p className="mt-1">All the comics on this website are only previews of the original comics, there may be many language errors, character names,
            and story lines. For the original version, please buy the comic if it's available in your city..</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
