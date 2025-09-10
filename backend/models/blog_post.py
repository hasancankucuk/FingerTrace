from typing import List, Optional
from datetime import datetime
from dataclasses import dataclass

@dataclass
class BlogAuthor:
    name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None

@dataclass
class BlogPost:
    id: Optional[str]
    title: str
    slug: str
    excerpt: str
    content: str
    author: BlogAuthor
    published_at: Optional[datetime]
    updated_at: Optional[datetime]
    tags: List[str]
    category: str
    read_time: int  # in minutes
    featured: bool
    cover_image: Optional[str]
    status: str  # 'draft', 'published', 'archived'
    created_by: str  # user uid
    created_at: datetime

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'excerpt': self.excerpt,
            'content': self.content,
            'author': {
                'name': self.author.name,
                'avatar': self.author.avatar,
                'bio': self.author.bio
            },
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'tags': self.tags,
            'category': self.category,
            'read_time': self.read_time,
            'featured': self.featured,
            'cover_image': self.cover_image,
            'status': self.status,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict):
        author_data = data.get('author', {})
        return cls(
            id=data.get('id'),
            title=data['title'],
            slug=data['slug'],
            excerpt=data['excerpt'],
            content=data['content'],
            author=BlogAuthor(
                name=author_data.get('name', ''),
                avatar=author_data.get('avatar'),
                bio=author_data.get('bio')
            ),
            published_at=datetime.fromisoformat(data['published_at']) if data.get('published_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None,
            tags=data.get('tags', []),
            category=data['category'],
            read_time=data.get('read_time', 5),
            featured=data.get('featured', False),
            cover_image=data.get('cover_image'),
            status=data.get('status', 'draft'),
            created_by=data['created_by'],
            created_at=datetime.fromisoformat(data['created_at'])
        )

@dataclass
class BlogCategory:
    id: Optional[str]
    name: str
    description: str
    slug: str
    created_at: datetime

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'slug': self.slug,
            'created_at': self.created_at.isoformat()
        }