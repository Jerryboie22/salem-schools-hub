import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  created_at: string;
}

const NewsSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching blog posts:", error);
        return;
      }

      setPosts(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">News & Updates</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest happenings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))
          ) : (
            posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {post.featured_image && (
                <div className="h-40 md:h-48 overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <h3 className="text-base md:text-lg font-bold line-clamp-2">{post.title}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="link" className="p-0 text-sm" asChild>
                  <Link to={`/news/${post.slug}`}>Read More →</Link>
                </Button>
              </CardFooter>
            </Card>
            ))
          )}
        </div>

        {!loading && posts.length === 0 && (
          <p className="text-center text-muted-foreground">No news available at the moment.</p>
        )}

        {!loading && posts.length > 0 && (
          <div className="text-center mt-6 md:mt-8">
            <Button variant="outline" className="touch-target" asChild>
              <Link to="/news">View All News</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
