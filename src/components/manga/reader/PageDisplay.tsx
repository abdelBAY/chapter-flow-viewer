
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page } from "@/types/manga";

interface PageDisplayProps {
  pages: Page[];
}

export const PageDisplay = ({ pages }: PageDisplayProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="space-y-4">
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="rounded-full bg-black/50 backdrop-blur-sm"
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </div>
      
      <div className={isVisible ? "opacity-100" : "opacity-0"}>
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
    </div>
  );
};
