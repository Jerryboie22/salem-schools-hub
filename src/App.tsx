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
import StudentDashboard from "./pages/portals/StudentDashboard";
import TeacherDashboard from "./pages/portals/TeacherDashboard";
import ParentDashboard from "./pages/portals/ParentDashboard";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChildrenSchool from "./pages/schools/ChildrenSchool";
import PrimarySchool from "./pages/schools/PrimarySchool";
import CovenantCollege from "./pages/schools/CovenantCollege";
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
          <Route path="/portal/student/dashboard" element={<StudentDashboard />} />
          <Route path="/portal/teacher" element={<TeacherPortal />} />
          <Route path="/portal/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/portal/parent" element={<ParentPortal />} />
          <Route path="/portal/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/portal/admin" element={<AdminPortal />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/schools/children" element={<ChildrenSchool />} />
          <Route path="/schools/primary" element={<PrimarySchool />} />
          <Route path="/schools/covenant" element={<CovenantCollege />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
