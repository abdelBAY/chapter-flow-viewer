
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { CreateGenreDialog } from "./CreateGenreDialog";
import { Edit, Trash } from "lucide-react";
import { EditGenreDialog } from "./EditGenreDialog";

export const GenreList = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: genres, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_genres")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const deleteGenre = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_genres").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast({ title: "Success", description: "Genre deleted successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete genre",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Genre Management</h1>
        <Button onClick={() => setIsCreateOpen(true)}>Add New Genre</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres?.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium">{genre.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingGenre(genre)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this genre?")) {
                          deleteGenre.mutate(genre.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateGenreDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {editingGenre && (
        <EditGenreDialog
          genre={editingGenre}
          open={!!editingGenre}
          onOpenChange={(open) => !open && setEditingGenre(null)}
        />
      )}
    </div>
  );
};

export default GenreList;
