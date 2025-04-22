
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChapterFromDB = {
  id: string;
  manga_id: string;
  number: number;
  title: string;
  pages: number;
  created_at: string;
  updated_at: string;
};

export type ChapterWithPages = ChapterFromDB & {
  page_images: string[];
};

export function useChapterWithPages(id?: string) {
  const isEditing = Boolean(id);
  const { data: chapter, isLoading } = useQuery({
    queryKey: ["chapter", id],
    queryFn: async () => {
      if (!id) return null;
      const { data: chapterData, error: chapterError } = await supabase
        .from("cms_chapters")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (chapterError) throw chapterError;

      if (chapterData) {
        const { data: pagesData, error: pagesError } = await supabase
          .from("cms_pages")
          .select("*")
          .eq("chapter_id", id)
          .order("page_number");

        if (pagesError) throw pagesError;

        const chapterWithPages: ChapterWithPages = {
          ...chapterData,
          page_images: pagesData?.map(page => page.image_url) || [],
        };

        return chapterWithPages;
      }

      return chapterData;
    },
    enabled: isEditing,
  });

  return { chapter, isLoading };
}
