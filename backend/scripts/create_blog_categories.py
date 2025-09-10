from datetime import datetime
from helpers.firebase_utils import firestore_add
import uuid

def create_default_categories():
    """Create default blog categories"""
    categories = [
        {
            'id': str(uuid.uuid4()),
            'name': 'Guide',
            'description': 'Step-by-step guides and tutorials',
            'slug': 'guide',
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Tutorial',
            'description': 'Technical tutorials and how-tos',
            'slug': 'tutorial',
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'News',
            'description': 'Company news and updates',
            'slug': 'news',
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Security',
            'description': 'Security-related content',
            'slug': 'security',
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Privacy',
            'description': 'Privacy and compliance topics',
            'slug': 'privacy',
            'created_at': datetime.utcnow().isoformat()
        }
    ]
    
    for category in categories:
        firestore_add('blog_categories', category, category['id'])
    
    print(f"Created {len(categories)} default categories")

if __name__ == "__main__":
    create_default_categories()