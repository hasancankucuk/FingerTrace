import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const BlogHeroSection = () => {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="px-3 py-1">
              <BookOpen className="h-3 w-3 mr-1" />
              Blog
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-primary">FingerTrace</span> Blog
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Latest insights on browser fingerprinting, device identification, 
            privacy, and web security.
          </p>
        </div>
      </div>
    </div>
  );
};