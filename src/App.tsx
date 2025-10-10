import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Leadership from "./pages/Leadership";
import VisionMission from "./pages/VisionMission";
import Library from "./pages/Library";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import StudentPortal from "./pages/portals/StudentPortal";
import TeacherPortal from "./pages/portals/TeacherPortal";
import ParentPortal from "./pages/portals/ParentPortal";
import AdminPortal from "./pages/portals/AdminPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/library" element={<Library />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/portal/student" element={<StudentPortal />} />
          <Route path="/portal/teacher" element={<TeacherPortal />} />
          <Route path="/portal/parent" element={<ParentPortal />} />
          <Route path="/portal/admin" element={<AdminPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
