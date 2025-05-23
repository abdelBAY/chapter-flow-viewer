
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MangaOption {
  id: string;
  title: string;
}

export function useMangaOptions() {
  const { data: mangas = [], isLoading } = useQuery({
    queryKey: ["admin-mangas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_mangas")
        .select("id, title")
        .order("title");
      
      if (error) throw error;
      // We don't need to use the adapter here since we're just getting id and title
      return data as MangaOption[] ?? [];
    },
  });
  
  return { mangas, isLoading };
}
