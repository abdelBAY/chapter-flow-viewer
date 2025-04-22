
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ChapterPagesUploader from "@/components/admin/ChapterPagesUploader";

// Define the type for the chapter data that comes from the database
type ChapterFromDB = {
  id: string;
  manga_id: string;
  number: number;
  title: string;
  pages: number;
  created_at: string;
  updated_at: string;
};

// Extended type that includes page_images
type ChapterWithPages = ChapterFromDB & {
  page_images: string[];
};

type ChapterFormData = {
  manga_id: string;
  number: number;
  title: string;
  pages: number;
  page_images: string[];
};

export default function ChapterForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: mangas = [], isLoading: loadingMangas } = useQuery({
    queryKey: ["admin-mangas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_mangas").select("id, title").order("title");
      if (error) throw error;
      return data ?? [];
    }
  });

  const { data: chapter, isLoading: loadingChapter } = useQuery({
    queryKey: ["chapter", id],
    queryFn: async () => {
      if (!id) return null;
      const { data: chapterData, error: chapterError } = await supabase
        .from("cms_chapters")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (chapterError) throw chapterError;
      
      // If we have a chapter, fetch its pages
      if (chapterData) {
        const { data: pagesData, error: pagesError } = await supabase
          .from("cms_pages")
          .select("*")
          .eq("chapter_id", id)
          .order("page_number");
        
        if (pagesError) throw pagesError;
        
        // Add the page_images to the chapter data
        const chapterWithPages: ChapterWithPages = {
          ...chapterData,
          page_images: pagesData?.map(page => page.image_url) || []
        };
        
        return chapterWithPages;
      }
      
      return chapterData;
    },
    enabled: isEditing,
  });

  const form = useForm<ChapterFormData>({
    defaultValues: {
      manga_id: "",
      number: 1,
      title: "",
      pages: 1,
      page_images: [],
    },
  });

  useEffect(() => {
    if (chapter) {
      form.reset({
        manga_id: chapter.manga_id,
        number: chapter.number,
        title: chapter.title,
        pages: chapter.pages,
        // Safely access page_images with a fallback to empty array
        page_images: (chapter as ChapterWithPages).page_images || [],
      });
    }
  }, [chapter, form]);

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

  if (loadingMangas || (isEditing && loadingChapter)) {
    return <div className="container mx-auto py-8 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
    </div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <Card>
        <CardContent className="py-8">
          <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Chapter" : "Create Chapter"}</h1>
          <form className="space-y-5" onSubmit={form.handleSubmit((data) => {
            data.pages = data.page_images.length;
            mutation.mutate(data);
          })}>
            <div>
              <Label htmlFor="manga">Manga Series</Label>
              <select
                id="manga"
                {...form.register("manga_id", { required: true })}
                className="block mt-1 w-full rounded-md border border-input px-3 py-2 bg-background text-base"
                disabled={isEditing}
              >
                <option value="">Select manga</option>
                {mangas.map((manga: any) => (
                  <option key={manga.id} value={manga.id}>{manga.title}</option>
                ))}
              </select>
              {form.formState.errors.manga_id && (
                <p className="text-sm text-destructive mt-1">Please select a manga</p>
              )}
            </div>
            <div>
              <Label htmlFor="number">Chapter Number</Label>
              <Input
                id="number"
                type="number"
                min={1}
                step={1}
                {...form.register("number", { required: true, valueAsNumber: true })}
              />
              {form.formState.errors.number && (
                <p className="text-sm text-destructive mt-1">Enter chapter number</p>
              )}
            </div>
            <div>
              <Label htmlFor="title">Chapter Title</Label>
              <Input
                id="title"
                {...form.register("title", { required: true })}
                placeholder='e.g. "The Adventure Begins"'
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">Title is required</p>
              )}
            </div>
            <ChapterPagesUploader
              value={form.watch("page_images")}
              onChange={(urls) => form.setValue("page_images", urls)}
            />
            <div>
              <Label htmlFor="pages">Number of Pages</Label>
              <Input
                id="pages"
                type="number"
                min={1}
                step={1}
                value={form.watch("page_images").length}
                readOnly
                className="bg-muted"
                {...form.register("pages")}
              />
              {form.formState.errors.pages && (
                <p className="text-sm text-destructive mt-1">Enter page count</p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Chapter" : "Create Chapter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
