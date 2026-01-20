import token
from pydantic import BaseModel
from typing import List, Optional


class AboutCompanyIn(BaseModel):
    title: str
    description: str

class StageIn(BaseModel):
    title: str
    description: str
    img: Optional[str] = None

class ResultImageIn(BaseModel):
    type: str
    img: Optional[str] = None

class ResultIn(BaseModel):
    title: str
    description: str
    images: List[ResultImageIn]

class ProgressIn(BaseModel):
    digit: int
    text: str

class ProjectIn(BaseModel):
    title: str
    url: str
    preview_img: Optional[str]
    main_img: Optional[str]
    target: str
    task: str
    about_company: AboutCompanyIn
    stages: List[StageIn]
    result: ResultIn
    progress: List[ProgressIn]


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int
    roles: List[str]

class UserCreate(BaseModel):
    email: str
    password: str
    fullname: Optional[str] = None
    role_ids: List[int]

class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    fullname: Optional[str] = None
    role_ids: Optional[List[int]] = None