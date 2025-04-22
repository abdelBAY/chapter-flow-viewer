import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ChapterPagesUploader from "@/components/admin/ChapterPagesUploader";
import MangaSelect from "./fields/MangaSelect";
import ChapterNumberInput from "./fields/ChapterNumberInput";
import ChapterTitleInput from "./fields/ChapterTitleInput";
import PagesInput from "./fields/PagesInput";
import { useMangaOptions } from "./hooks/useMangaOptions";
import { useChapterWithPages, ChapterWithPages } from "./hooks/useChapterWithPages";
import { useChapterMutation } from "./hooks/useChapterMutation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export type ChapterFormData = {
  manga_id: string;
  number: number;
  title: string;
  pages: number;
  page_images: string[];
};

export default function ChapterForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { mangas, isLoading: loadingMangas } = useMangaOptions();
  const { chapter, isLoading: loadingChapter } = useChapterWithPages(id);
  const mutation = useChapterMutation(isEditing, id);

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
        page_images: (chapter as ChapterWithPages).page_images || [],
      });
    }
  }, [chapter, form]);

  if (loadingMangas || (isEditing && loadingChapter)) {
    return <div className="container mx-auto py-8 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
    </div>;
  }

  const { watch, setValue, formState } = form;

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <Card>
        <CardContent className="py-8">
          <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Chapter" : "Create Chapter"}</h1>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit((data) => {
              data.pages = data.page_images.length;
              mutation.mutate(data);
            })}
          >
            <MangaSelect
              value={watch("manga_id")}
              onChange={v => setValue("manga_id", v)}
              options={mangas}
              disabled={isEditing}
              error={formState.errors.manga_id}
            />
            <ChapterNumberInput
              value={watch("number")}
              onChange={n => setValue("number", n)}
              error={formState.errors.number}
            />
            <ChapterTitleInput
              value={watch("title")}
              onChange={v => setValue("title", v)}
              error={formState.errors.title}
            />
            <ChapterPagesUploader
              value={watch("page_images")}
              onChange={urls => setValue("page_images", urls)}
            />
            <PagesInput
              value={watch("page_images").length}
              error={formState.errors.pages}
            />
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
