from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    TIMESTAMP,
    ForeignKey,
    UniqueConstraint,
    func
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Project(Base):

    __tablename__ = "project"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    url = Column(String)
    preview_img = Column(Text)
    main_img = Column(Text)
    notebook_img = Column(Text)
    target = Column(Text)
    task = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    about_company = relationship(
        "ProjectAboutCompany",
        uselist=False,
        back_populates="project",
        cascade="all, delete-orphan"
    )
    stages = relationship(
        "ProjectStage",
        back_populates="project",
        cascade="all, delete-orphan"
    )
    result = relationship(
        "ProjectResult",
        uselist=False,
        back_populates="project",
        cascade="all, delete-orphan"
    )
    progresses = relationship(
        "ProjectProgress",
        back_populates="project",
        cascade="all, delete-orphan"
    )


class ProjectAboutCompany(Base):
    __tablename__ = "project_about_company"
    __table_args__ = (UniqueConstraint('project_id'),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.id", ondelete="CASCADE"), unique=True)
    title = Column(String)
    description = Column(Text)

    project = relationship("Project", back_populates="about_company")


class ProjectStage(Base):
    __tablename__ = "project_stage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.id", ondelete="CASCADE"))
    title = Column(String)
    description = Column(Text)
    img = Column(Text)

    project = relationship("Project", back_populates="stages")


class ProjectResult(Base):
    __tablename__ = "project_result"
    __table_args__ = (UniqueConstraint('project_id'),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.id", ondelete="CASCADE"), unique=True)
    description = Column(Text)

    project = relationship("Project", back_populates="result")
    images = relationship(
        "ProjectResultImage",
        back_populates="result",
        cascade="all, delete-orphan"
    )


class ProjectResultImage(Base):
    __tablename__ = "project_result_image"

    id = Column(Integer, primary_key=True, autoincrement=True)
    result_id = Column(Integer, ForeignKey("project_result.id", ondelete="CASCADE"))
    type = Column(String)  
    img = Column(Text)

    result = relationship("ProjectResult", back_populates="images")


class ProjectProgress(Base):
    __tablename__ = "project_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.id", ondelete="CASCADE"))
    text = Column(String)
    digit = Column(Integer)

    project = relationship("Project", back_populates="progresses")



class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    fullname = Column(String)
    role_ids = Column(String, nullable=False)  # Храним ID ролей через запятую, например: "1,2,3"
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def get_role_ids_list(self):
        """Возвращает список ID ролей как integers"""
        if not self.role_ids:
            return []
        return [int(rid.strip()) for rid in self.role_ids.split(",") if rid.strip()]
    
    def set_role_ids_list(self, role_id_list):
        """Устанавливает роли из списка integers"""
        self.role_ids = ",".join(str(rid) for rid in role_id_list)
    
    def get_roles(self, session):
        """Получает объекты Role для данного пользователя"""
        role_id_list = self.get_role_ids_list()
        if not role_id_list:
            return []
        return session.query(Role).filter(Role.id.in_(role_id_list)).all()