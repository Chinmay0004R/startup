from typing import List

from fastapi import APIRouter, HTTPException, Query

from app.schemas.post import PostCreate, PostRead

router = APIRouter(prefix="/posts", tags=["posts"])

POSTS: List[PostRead] = []


@router.get("/", response_model=List[PostRead])
def list_posts(author_id: int | None = Query(default=None, description="Filter posts by doctor id")):
    if author_id is None:
        return POSTS

    return [post for post in POSTS if post.author_id == author_id]


@router.post("/", response_model=PostRead)
def create_post(payload: PostCreate):
    post = PostRead(
        id=len(POSTS) + 1,
        author_name=payload.author_name,
        content=payload.content,
        likes=payload.likes or 0,
        author_id=payload.author_id,
    )
    POSTS.append(post)
    return post


@router.post("/{post_id}/like", response_model=PostRead)
def like_post(post_id: int):
    for post in POSTS:
        if post.id == post_id:
            post.likes += 1
            return post

    raise HTTPException(status_code=404, detail="Post not found")
