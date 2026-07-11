from pydantic import BaseModel


class PostBase(BaseModel):
    author_name: str
    content: str
    likes: int = 0
    author_id: int | None = None


class PostCreate(PostBase):
    pass


class PostRead(PostBase):
    id: int

    class Config:
        orm_mode = True
