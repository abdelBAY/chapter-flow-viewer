
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface MangaFormData {
  title: string;
  description: string;
  author: string;
  artist: string;
  status: "ongoing" | "completed" | "hiatus";
  cover_url: string;
}

export const useMangaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const form = useForm<MangaFormData>({
    defaultValues: {
      title: "",
      description: "",
      author: "",
      artist: "",
      status: "ongoing",
      cover_url: "",
    },
  });

  const { data: manga } = useQuery({
    queryKey: ["manga", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("cms_mangas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  const onSubmit = async (data: MangaFormData) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from("cms_mangas")
          .update(data)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Manga updated successfully",
        });
      } else {
        const { error } = await supabase.from("cms_mangas").insert(data);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Manga created successfully",
        });
      }

      navigate("/admin/manga");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return {
    form,
    manga,
    isEditing,
    onSubmit,
    navigate,
  };
};
