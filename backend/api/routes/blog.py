from flask import Blueprint, jsonify, request
from services.blog_service import BlogService

blog_bp = Blueprint("blog", __name__)

@blog_bp.route("/blog", methods=["GET"])
def get_blog_posts():
    """Get published blog posts with pagination and filtering"""
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        category = request.args.get("category")
        tag = request.args.get("tag")
        search = request.args.get("search")
        
        # Validate pagination
        page = max(1, page)
        limit = max(1, min(limit, 50))  # Max 50 posts per page
        
        result = BlogService.get_published_blog_posts(
            page=page,
            limit=limit,
            category=category,
            tag=tag,
            search=search
        )
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@blog_bp.route("/blog/<slug>", methods=["GET"])
def get_blog_post(slug):
    """Get a specific blog post by slug"""
    try:
        post = BlogService.get_blog_post_by_slug(slug)
        if not post:
            return jsonify({"error": "Blog post not found"}), 404
        
        return jsonify(post.to_dict()), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@blog_bp.route("/blog/featured", methods=["GET"])
def get_featured_posts():
    """Get featured blog posts"""
    try:
        posts = BlogService.get_featured_posts()
        return jsonify([post.to_dict() for post in posts]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@blog_bp.route("/blog/categories", methods=["GET"])
def get_blog_categories():
    """Get all blog categories"""
    try:
        categories = BlogService.get_categories()
        return jsonify([cat.to_dict() for cat in categories]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500