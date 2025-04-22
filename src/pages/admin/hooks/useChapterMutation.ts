
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ChapterFormData } from "../ChapterForm";

export function useChapterMutation(isEditing: boolean, id?: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ChapterFormData) => {
      let chapterIdToUse = id;

      if (isEditing) {
        const { error } = await supabase
          .from("cms_chapters")
          .update({
            manga_id: values.manga_id,
            number: values.number,
            title: values.title,
            pages: values.page_images.length,
          })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("cms_chapters")
          .insert([
            {
              manga_id: values.manga_id,
              number: values.number,
              title: values.title,
              pages: values.page_images.length,
            }
          ])
          .select("id")
          .maybeSingle();
        if (error) throw error;
        chapterIdToUse = data?.id;
      }

      if (values.page_images.length > 0 && chapterIdToUse) {
        if (isEditing) {
          const { error } = await supabase
            .from("cms_pages")
            .delete()
            .eq("chapter_id", chapterIdToUse);

          if (error) throw error;
        }

        const pageInsertions = values.page_images.map((url, index) => ({
          chapter_id: chapterIdToUse,
          page_number: index + 1,
          image_url: url,
        }));

        const { error } = await supabase
          .from("cms_pages")
          .insert(pageInsertions);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ 
        title: isEditing ? "Chapter updated" : "Chapter created",
        description: isEditing 
          ? "Your chapter has been successfully updated." 
          : "Your new chapter has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["admin-chapters"] });
      navigate("/admin/chapters");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      console.error("Form submission error:", error);
    }
  });

  return mutation;
}
