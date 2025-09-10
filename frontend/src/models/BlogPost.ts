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
  published_at?: string; // Make optional
  updated_at?: string;
  created_at: string; // Required
  tags: string[];
  category: string;
  read_time: number; // in minutes
  featured: boolean;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}