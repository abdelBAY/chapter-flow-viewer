
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Manga {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  manga_id: string;
  title: string;
  number: number;
  pages: number;
  created_at: string;
}

export default function ChapterList() {
  const queryClient = useQueryClient();

  // Fetch all chapters (with manga titles)
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["admin-chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_chapters")
        .select("id, manga_id, title, number, pages, created_at");
      if (error) throw error;
      return data as Chapter[];
    }
  });

  const { data: mangas } = useQuery({
    queryKey: ["admin-mangas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_mangas")
        .select("id, title");
      if (error) throw error;
      return data as Manga[];
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_chapters").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id: string) => {
      toast({ title: "Chapter deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-chapters"] });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      deleteMutation.mutate(id);
    }
  };

  // Helper: map manga_id to manga title
  const mangaTitle = (manga_id: string) => mangas?.find((m) => m.id === manga_id)?.title || "Unknown";

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Chapters</h1>
        <Button asChild>
          <Link to="/admin/chapters/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Chapter
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : !chapters || chapters.length === 0 ? (
            <div className="py-8 text-muted-foreground text-center">No chapters found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Manga</TableHead>
                    <TableHead>Chapter Title</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chapters.map((chapter, idx) => (
                    <TableRow key={chapter.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{mangaTitle(chapter.manga_id)}</TableCell>
                      <TableCell>{chapter.title}</TableCell>
                      <TableCell>{chapter.number}</TableCell>
                      <TableCell>{chapter.pages}</TableCell>
                      <TableCell>{(new Date(chapter.created_at)).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/chapters/${chapter.id}/edit`}>
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(chapter.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
