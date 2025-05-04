
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121418]">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
