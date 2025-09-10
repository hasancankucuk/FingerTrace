from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import re
from helpers.firebase_utils import firestore_add, firestore_get_all, firestore_get_by_id, firestore_update, firestore_delete
from models.blog_post import BlogPost, BlogAuthor, BlogCategory

class BlogService:
    COLLECTION_NAME = "blog_posts"
    CATEGORIES_COLLECTION = "blog_categories"

    @staticmethod
    def create_blog_post(post_data: Dict[str, Any], author_name: str) -> BlogPost:
        """Create a new blog post"""
        now = datetime.utcnow()
        post_id = str(uuid.uuid4())
        
        # Calculate read time (approximately 200 words per minute)
        content = post_data.get('content', '')
        word_count = len(content.split())
        read_time = max(1, round(word_count / 200))
        
        # Create author object
        author = BlogAuthor(
            name=author_name,
            avatar=post_data.get('author_avatar'),
            bio=post_data.get('author_bio')
        )
        
        blog_post = BlogPost(
            id=post_id,
            title=post_data['title'],
            slug=BlogService._generate_slug(post_data['title']),
            excerpt=post_data['excerpt'],
            content=post_data['content'],
            author=author,
            published_at=now if post_data.get('status') == 'published' else None,
            updated_at=None,
            tags=post_data.get('tags', []),
            category=post_data['category'],
            read_time=read_time,
            featured=post_data.get('featured', False),
            cover_image=post_data.get('cover_image'),
            status=post_data.get('status', 'draft'),
            created_by='admin',  # Fixed admin value
            created_at=now
        )
        
        # Save to Firestore
        firestore_add(BlogService.COLLECTION_NAME, blog_post.to_dict(), post_id)
        return blog_post

    @staticmethod
    def update_blog_post(post_id: str, update_data: Dict[str, Any]) -> BlogPost:
        """Update an existing blog post"""
        # Get existing post
        existing_data = firestore_get_by_id(BlogService.COLLECTION_NAME, post_id)
        if not existing_data:
            raise ValueError("Blog post not found")
        
        existing_post = BlogPost.from_dict(existing_data)
        now = datetime.utcnow()
        
        # Update fields
        if 'title' in update_data:
            existing_post.title = update_data['title']
            if 'slug' not in update_data:
                existing_post.slug = BlogService._generate_slug(update_data['title'])
        
        if 'slug' in update_data:
            existing_post.slug = update_data['slug']
        if 'excerpt' in update_data:
            existing_post.excerpt = update_data['excerpt']
        if 'content' in update_data:
            existing_post.content = update_data['content']
            # Recalculate read time
            word_count = len(update_data['content'].split())
            existing_post.read_time = max(1, round(word_count / 200))
        if 'tags' in update_data:
            existing_post.tags = update_data['tags']
        if 'category' in update_data:
            existing_post.category = update_data['category']
        if 'featured' in update_data:
            existing_post.featured = update_data['featured']
        if 'cover_image' in update_data:
            existing_post.cover_image = update_data['cover_image']
        if 'status' in update_data:
            existing_post.status = update_data['status']
            if update_data['status'] == 'published' and not existing_post.published_at:
                existing_post.published_at = now
        
        existing_post.updated_at = now
        
        # Save to Firestore
        firestore_update(BlogService.COLLECTION_NAME, post_id, existing_post.to_dict())
        return existing_post

    @staticmethod
    def delete_blog_post(post_id: str) -> bool:
        """Delete a blog post"""
        # Get existing post
        existing_data = firestore_get_by_id(BlogService.COLLECTION_NAME, post_id)
        if not existing_data:
            raise ValueError("Blog post not found")
        
        firestore_delete(BlogService.COLLECTION_NAME, post_id)
        return True

    @staticmethod
    def get_all_blog_posts() -> List[BlogPost]:
        """Get all blog posts (admin view)"""
        posts = firestore_get_all(BlogService.COLLECTION_NAME)
        all_posts = []
        
        for post_data in posts:
            if isinstance(post_data, dict):
                all_posts.append(BlogPost.from_dict(post_data))
        
        # Sort by created date (newest first)
        all_posts.sort(key=lambda x: x.created_at, reverse=True)
        return all_posts

    @staticmethod
    def get_blog_post_by_slug(slug: str) -> Optional[BlogPost]:
        """Get a blog post by slug (public endpoint)"""
        posts = firestore_get_all(BlogService.COLLECTION_NAME)
        for post_data in posts:
            if isinstance(post_data, dict) and post_data.get('slug') == slug and post_data.get('status') == 'published':
                return BlogPost.from_dict(post_data)
        return None

    @staticmethod
    def get_blog_post_by_id(post_id: str) -> Optional[BlogPost]:
        """Get a blog post by ID"""
        post_data = firestore_get_by_id(BlogService.COLLECTION_NAME, post_id)
        if post_data:
            return BlogPost.from_dict(post_data)
        return None

    @staticmethod
    def get_published_blog_posts(
        page: int = 1, 
        limit: int = 10, 
        category: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get published blog posts with pagination and filtering"""
        posts = firestore_get_all(BlogService.COLLECTION_NAME)
        published_posts = []
        
        for post_data in posts:
            if isinstance(post_data, dict) and post_data.get('status') == 'published':
                post = BlogPost.from_dict(post_data)
                
                # Apply filters
                if category and post.category.lower() != category.lower():
                    continue
                if tag and tag.lower() not in [t.lower() for t in post.tags]:
                    continue
                if search:
                    search_text = f"{post.title} {post.excerpt} {post.content}".lower()
                    if search.lower() not in search_text:
                        continue
                
                published_posts.append(post)
        
        # Sort by published date (newest first)
        published_posts.sort(key=lambda x: x.published_at or datetime.min, reverse=True)
        
        # Pagination
        total = len(published_posts)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_posts = published_posts[start_idx:end_idx]
        
        return {
            'posts': [post.to_dict() for post in paginated_posts],
            'total': total,
            'page': page,
            'total_pages': (total + limit - 1) // limit
        }

    @staticmethod
    def get_featured_posts() -> List[BlogPost]:
        """Get featured published posts"""
        posts = firestore_get_all(BlogService.COLLECTION_NAME)
        featured_posts = []
        
        for post_data in posts:
            if (isinstance(post_data, dict) and 
                post_data.get('status') == 'published' and 
                post_data.get('featured', False)):
                featured_posts.append(BlogPost.from_dict(post_data))
        
        # Sort by published date (newest first)
        featured_posts.sort(key=lambda x: x.published_at or datetime.min, reverse=True)
        return featured_posts

    @staticmethod
    def get_categories() -> List[BlogCategory]:
        """Get all blog categories"""
        categories_data = firestore_get_all(BlogService.CATEGORIES_COLLECTION)
        categories = []
        
        for cat_data in categories_data:
            if isinstance(cat_data, dict):
                categories.append(BlogCategory(
                    id=cat_data.get('id'),
                    name=cat_data['name'],
                    description=cat_data['description'],
                    slug=cat_data['slug'],
                    created_at=datetime.fromisoformat(cat_data['created_at'])
                ))
        
        return sorted(categories, key=lambda x: x.name)

    @staticmethod
    def _generate_slug(title: str) -> str:
        """Generate URL-friendly slug from title"""
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'\s+', '-', slug)
        slug = slug.strip('-')
        return slug