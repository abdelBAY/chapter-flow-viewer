
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MangaList = () => {
  const { data: mangas, isLoading } = useQuery({
    queryKey: ["admin-mangas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_mangas")
        .select("*")
        .order("title");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load manga list",
        });
        throw error;
      }

      return data;
    },
  });

  const deleteManga = async (id: string) => {
    const { error } = await supabase.from("cms_mangas").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete manga",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Manga deleted successfully",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manga List</h1>
        <Button asChild>
          <Link to="/admin/manga/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Manga
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mangas?.map((manga) => (
              <TableRow key={manga.id}>
                <TableCell className="font-medium">{manga.title}</TableCell>
                <TableCell>{manga.author}</TableCell>
                <TableCell>{manga.artist}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      manga.status === "ongoing"
                        ? "border-green-500 text-green-500"
                        : manga.status === "completed"
                        ? "border-blue-500 text-blue-500"
                        : "border-amber-500 text-amber-500"
                    }
                  >
                    {manga.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/manga/${manga.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this manga?")) {
                          deleteManga(manga.id);
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
    </div>
  );
};

export default MangaList;
