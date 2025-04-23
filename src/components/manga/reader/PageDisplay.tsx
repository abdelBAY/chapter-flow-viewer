
import { Page } from "@/types/manga";

interface PageDisplayProps {
  pages: Page[];
}

export const PageDisplay = ({ pages }: PageDisplayProps) => {
  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <div key={page.id} className="w-full">
          <img 
            src={page.imageUrl} 
            alt={`Page ${page.pageNumber}`}
            className="w-full h-auto object-contain select-none"
          />
          <div className="text-center text-sm text-muted-foreground mt-2">
            Page {page.pageNumber}
          </div>
        </div>
      ))}
    </div>
  );
};
