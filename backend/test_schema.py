import json
from pydantic import BaseModel
from typing import Optional

class PostBase(BaseModel):
    author_name: str
    content: str
    likes: int = 0
    author_id: int | None = None

class PostCreate(PostBase):
    pass

try:
    p = PostCreate.parse_raw('{"author_name": "Doctor", "content": "hello"}')
    print("Valid:", p)
except Exception as e:
    print("Invalid:", e)
