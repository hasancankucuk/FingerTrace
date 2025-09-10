export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  readTime: number; // in minutes
  featured: boolean;
  coverImage?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}