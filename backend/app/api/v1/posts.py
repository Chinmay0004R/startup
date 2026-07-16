from typing import List

from fastapi import APIRouter, HTTPException, Query, Depends, status
from sqlalchemy.orm import Session

from app.schemas.post import PostCreate, PostRead
from app.core.database import get_db
from app.models.post import Post
from app.models.post_like import PostLike
from app.models.user import User, RoleEnum
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=List[PostRead])
def list_posts(author_id: int | None = Query(default=None, description="Filter posts by doctor id"), current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if author_id is None:
        posts = db.query(Post).all()
    else:
        posts = db.query(Post).filter(Post.author_id == author_id).all()

    return posts


@router.post("/", response_model=PostRead)
def create_post(payload: PostCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    post = Post(
        author_name=payload.author_name,
        content=payload.content,
        likes=payload.likes or 0,
        author_id=user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("/{post_id}", response_model=PostRead)
def get_post(post_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("/{post_id}/like", response_model=PostRead)
def like_post(post_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing_like = db.query(PostLike).filter(PostLike.post_id == post.id, PostLike.user_id == user.id).first()
    if existing_like:
        db.refresh(post)
        return post

    db.add(PostLike(post_id=post.id, user_id=user.id))
    post.likes = (post.likes or 0) + 1
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=PostRead)
def update_post(post_id: int, payload: PostCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user or post.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot update this post")

    post.content = payload.content
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}")
def delete_post(post_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    user = db.query(User).filter(User.email == current_user.get("email")).first()
    if not user or post.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete this post")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}
