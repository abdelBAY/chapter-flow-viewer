
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, BookOpen, Layout, ListTodos } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Manage Manga
            </CardTitle>
            <CardDescription>Create, edit, and delete manga titles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to="/admin/manga">View All Manga</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/manga/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Manga
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Manage Genres
            </CardTitle>
            <CardDescription>Organize manga by genres</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/genres">Manage Genres</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodos className="h-5 w-5" />
              Manage Chapters
            </CardTitle>
            <CardDescription>Add and edit manga chapters</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/chapters">Manage Chapters</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
