
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import MangaDetails from "./pages/MangaDetails";
import Reader from "./pages/Reader";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AdminRoute } from "./components/auth/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import MangaList from "./pages/admin/MangaList";
import MangaForm from "./pages/admin/MangaForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/manga/:id" element={<MangaDetails />} />
              <Route path="/manga/:id/chapter/:chapterId" element={<Reader />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/manga" element={<MangaList />} />
                <Route path="/admin/manga/new" element={<MangaForm />} />
                <Route path="/admin/manga/:id/edit" element={<MangaForm />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
