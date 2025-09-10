import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogPost } from "@/models/BlogPost";

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogPostCard = ({ post, featured = false }: BlogPostCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${
      featured ? 'col-span-2 row-span-2' : ''
    }`}>
      {post.coverImage && (
        <div className="relative overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          {post.featured && (
            <Badge className="absolute top-4 left-4">
              Featured
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime} min read
          </div>
        </div>
        
        <Badge variant="outline" className="w-fit">
          {post.category}
        </Badge>
        
        <h3 className={`font-bold group-hover:text-primary transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{post.author.name}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="group-hover:gap-2 transition-all">
            <Link to={`/blog/${post.slug}`} className="flex items-center gap-1">
              Read More
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};