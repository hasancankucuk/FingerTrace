import { useState, useEffect } from "react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { FooterSection } from "@/components/landing/FooterSection";
import { BlogHeroSection } from "@/components/blog/BlogHeroSection";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, } from "lucide-react";
import { getBlogPosts, getBlogCategories } from "@/services/blog";
import type { BlogPost, BlogCategory } from "@/models/BlogPost";

export const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBlogData();
  }, [page, selectedCategory, search]);

  const loadBlogData = async () => {
    setLoading(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        getBlogPosts({
          page,
          limit: 12,
          category: selectedCategory || undefined,
          search: search || undefined,
        }),
        getBlogCategories(),
      ]);
      
      setPosts(postsData.posts);
      setTotalPages(postsData.totalPages);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationBar />
      <BlogHeroSection />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("")}
            >
              All Posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};