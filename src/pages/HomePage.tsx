
import { useFetchMangas } from "@/hooks/useFetchMangas";
import FeaturedSection from "@/components/home/FeaturedSection";
import LatestUpdatesSection from "@/components/home/LatestUpdatesSection";
import PopularSeriesSection from "@/components/home/PopularSeriesSection";

const HomePage = () => {
  const { latestMangas, popularMangas, isLoading } = useFetchMangas();

  return (
    <div className="space-y-12 bg-[#121418] -mx-4 -my-6 p-4">
      {/* Featured manga carousel - larger cards at the top */}
      <section>
        <FeaturedSection mangas={popularMangas} isLoading={isLoading} />
      </section>

      {/* Latest Updates Section */}
      <section>
        <LatestUpdatesSection mangas={latestMangas} isLoading={isLoading} />
      </section>

      {/* Popular Series Section */}
      <section className="pb-8">
        <PopularSeriesSection mangas={popularMangas} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default HomePage;
