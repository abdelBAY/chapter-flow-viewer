
import { useState } from "react";
import { Manga } from "@/types/manga";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface FeaturedSectionProps {
  mangas: Manga[];
  isLoading: boolean;
}

const FeaturedSection = ({ mangas, isLoading }: FeaturedSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-xl" />
        ))}
      </div>
    );
  }

  // Use the first 3 popular manga for the featured section
  const featuredMangas = mangas.slice(0, 3);
  
  return (
    <Carousel
      className="mb-10"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {featuredMangas.map((manga) => (
          <CarouselItem key={manga.id} className="basis-full md:basis-1/3">
            <Link to={`/manga/${manga.id}`} className="block relative h-[280px] rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
              <img 
                src={manga.cover} 
                alt={manga.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-lg md:text-xl font-bold text-white line-clamp-2">{manga.title}</h3>
                <p className="text-sm text-white/80">by {manga.author}</p>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white" />
    </Carousel>
  );
};

export default FeaturedSection;
