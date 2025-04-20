
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MangaFormData {
  title: string;
  description: string;
  author: string;
  artist: string;
  status: "ongoing" | "completed" | "hiatus";
  cover_url: string;
}

const MangaForm = () => {
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

  useEffect(() => {
    if (manga) {
      form.reset(manga);
    }
  }, [manga, form]);

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

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Manga" : "Create New Manga"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter manga title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter manga description"
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter author name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter artist name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manga status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="hiatus">Hiatus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter cover image URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">
              {isEditing ? "Update Manga" : "Create Manga"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/manga")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MangaForm;
