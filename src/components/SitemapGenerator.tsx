import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SitemapGenerator = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch all published blog posts
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("slug, updated_at")
          .eq("is_published", true)
          .order("updated_at", { ascending: false });

        // Log for debugging - in production you'd send this to your edge function
        console.log("Sitemap data ready:", { posts });
      } catch (error) {
        console.error("Error preparing sitemap data:", error);
      }
    };

    generateSitemap();
  }, []);

  return null;
};

export default SitemapGenerator;
