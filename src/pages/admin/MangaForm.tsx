
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "@/components/manga/form/BasicInfoFields";
import { DetailsFields } from "@/components/manga/form/DetailsFields";
import { useMangaForm } from "@/hooks/useMangaForm";

const MangaForm = () => {
  const { form, manga, isEditing, onSubmit, navigate } = useMangaForm();

  useEffect(() => {
    if (manga) {
      form.reset(manga);
    }
  }, [manga, form]);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Manga" : "Create New Manga"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields form={form} />
          <DetailsFields form={form} />

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
