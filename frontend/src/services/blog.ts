import type { BlogPost, BlogCategory } from '@/models/BlogPost';
import { httpRequest } from './http';

const API_BASE_URL = import.meta.env.VITE_APP_URL;

export const getBlogPosts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<{
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.category) searchParams.set('category', params.category);
  if (params?.tag) searchParams.set('tag', params.tag);
  if (params?.search) searchParams.set('search', params.search);

  return httpRequest(`${API_BASE_URL}/blog?${searchParams}`, {
    method: 'GET',
  });
};

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  return httpRequest(`${API_BASE_URL}/blog/${slug}`, {
    method: 'GET',
  });
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  return httpRequest(`${API_BASE_URL}/blog/categories`, {
    method: 'GET',
  });
};

export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  return httpRequest(`${API_BASE_URL}/blog/featured`, {
    method: 'GET',
  });
};