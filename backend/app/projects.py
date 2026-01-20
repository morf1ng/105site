from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from typing import List, Optional
import shutil, os, json

from .database import get_session
from .dependencies import get_current_user, role_required

from .models import Project, ProjectAboutCompany, ProjectStage, ProjectResult, ProjectResultImage, ProjectProgress

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
STAGES_UPLOADS_DIR = os.path.join(UPLOADS_DIR, "stages")
RESULTS_UPLOADS_DIR = os.path.join(UPLOADS_DIR, "results")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(STAGES_UPLOADS_DIR, exist_ok=True)
os.makedirs(RESULTS_UPLOADS_DIR, exist_ok=True)

def save_file(file: Optional[UploadFile], *, directory: Optional[str] = None) -> Optional[str]:
    if file is None:
        return None
    if not hasattr(file, 'filename') or not file.filename or file.filename.strip() == '':
        return None
    target_dir = directory if directory else UPLOADS_DIR
    os.makedirs(target_dir, exist_ok=True)
    file_loc = os.path.join(target_dir, file.filename)
    with open(file_loc, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    if directory and directory.startswith(UPLOADS_DIR):
        rel_path = os.path.relpath(file_loc, UPLOADS_DIR)
        return rel_path.replace("\\", "/")
    return file.filename

def parse_json_field(field: Optional[str]):
    if not field:
        return None
    if isinstance(field, str):
        field = field.strip()
        if not field:
            return None
        try:
            return json.loads(field)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    return field

def fetch_full_project(session: Session, project_id: int) -> Optional[Project]:
    stmt = select(Project).where(Project.id == project_id).options(
        selectinload(Project.about_company),
        selectinload(Project.stages),
        selectinload(Project.result).selectinload(ProjectResult.images),
        selectinload(Project.progresses)
    )
    result = session.execute(stmt)
    return result.scalars().first()

def serialize_project(project: Project):
    return {
        "id": project.id,
        "title": project.title,
        "url": project.url,
        "preview_img": project.preview_img,
        "main_img": project.main_img,
        "notebook_img": project.notebook_img,
        "target": project.target,
        "task": project.task,
        "about_company": {
            "title": project.about_company.title,
            "description": project.about_company.description
        } if project.about_company else None,
        "stages": [
            {"title": s.title, "description": s.description, "img": s.img}
            for s in project.stages
        ],
        "result": {
            "description": project.result.description,
            "images": [
                {"type": img.type, "img": img.img}
                for img in (project.result.images if project.result else [])
            ]
        } if project.result else None,
        "progress": [
            {"digit": pr.digit, "text": pr.text}
            for pr in project.progresses
        ]
    }

@router.post("/projects")
def create_project(
    title: str = Form(...), url: str = Form(...), target: str = Form(""), task: str = Form(""),
    about_company: str = Form("{}"), stages: str = Form("[]"), result: str = Form("{}"), progress: str = Form("[]"),
    preview_img: Optional[UploadFile] = File(None), main_img: Optional[UploadFile] = File(None), notebook_img: Optional[UploadFile] = File(None),
    stage_imgs: Optional[List[UploadFile]] = File(None), result_imgs: Optional[List[UploadFile]] = File(None),
    session: Session = Depends(get_session),
    user=Depends(role_required("admin")),
):
    preview_img_name = save_file(preview_img)
    main_img_name = save_file(main_img)
    notebook_img_name = save_file(notebook_img)

    stage_img_names = []
    if stage_imgs:
        for img in stage_imgs:
            stage_img_names.append(save_file(img, directory=STAGES_UPLOADS_DIR))
    result_img_names = []
    if result_imgs:
        for img in result_imgs:
            result_img_names.append(save_file(img, directory=RESULTS_UPLOADS_DIR))
    if result_imgs and not result_img_names:
        raise HTTPException(status_code=400, detail="result_imgs загружены, но имена файлов не получены")
    

    about_company_data = parse_json_field(about_company)
    stages_data = parse_json_field(stages) or []
    result_data = parse_json_field(result)
    progress_data = parse_json_field(progress) or []

    if not about_company_data:
        raise HTTPException(status_code=400, detail="about_company is required")
    if not result_data:
        raise HTTPException(status_code=400, detail="result is required")

    about_obj = ProjectAboutCompany(**about_company_data)
    stages_obj = []
    for idx, s in enumerate(stages_data):
        img_name = s.get("img")
        if not img_name and idx < len(stage_img_names):
            img_name = stage_img_names[idx]
        stages_obj.append(ProjectStage(title=s["title"], description=s["description"], img=img_name))
    result_images = []
    images_meta = result_data.get("images") or []
    if images_meta:
        for idx, img in enumerate(images_meta):
            uploaded_img = result_img_names[idx] if idx < len(result_img_names) else None
            img_name = uploaded_img or img.get("img")
            img_type = "tablet" if idx == 0 else "smartphone"
            result_images.append(ProjectResultImage(type=img_type, img=img_name))
    else:
        # если метаданные картинок не пришли, создаём изображения только по загруженным файлам
        for idx, img_name in enumerate(result_img_names):
            img_type = "tablet" if idx == 0 else "smartphone"
            result_images.append(ProjectResultImage(type=img_type, img=img_name))

    result_obj = ProjectResult(
        description=result_data.get("description"),
        images=result_images
    )
    progress_obj = [ProjectProgress(digit=p["digit"], text=p["text"]) for p in progress_data]

    project = Project(
        title=title, url=url, preview_img=preview_img_name, main_img=main_img_name, notebook_img=notebook_img_name,
        target=target, task=task, about_company=about_obj, stages=stages_obj, result=result_obj, progresses=progress_obj
    )
    session.add(project)
    session.commit()
    project = fetch_full_project(session, project.id)
    return serialize_project(project)

@router.get("/projects")
def get_projects(
    session: Session = Depends(get_session),
):
    result = session.execute(select(Project))
    projects = result.scalars().all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "preview_img": p.preview_img,
            "result": {
                "description": p.result.description if p.result else None,
            },
        }
        for p in projects
    ]

@router.get("/projects/{project_id}")
def get_full_project(
    project_id: int,
    session: Session = Depends(get_session),
):
    project = fetch_full_project(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    return serialize_project(project)

@router.put("/projects/{project_id}")
def update_project(
    project_id: int,
    title: str = Form(...), url: str = Form(...), target: str = Form(""), task: str = Form(""),
    about_company: str = Form("{}"), stages: str = Form("[]"), result: str = Form("{}"), progress: str = Form("[]"),
    preview_img: Optional[UploadFile] = File(None), main_img: Optional[UploadFile] = File(None), notebook_img: Optional[UploadFile] = File(None),
    stage_imgs: Optional[List[UploadFile]] = File(None), result_imgs: Optional[List[UploadFile]] = File(None),
    session: Session = Depends(get_session),
    user=Depends(role_required("admin")),
):
    project = fetch_full_project(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Not found")

    project.title = title
    project.url = url
    project.target = target
    project.task = task
    if preview_img:
        project.preview_img = save_file(preview_img)
    if main_img:
        project.main_img = save_file(main_img)
    if notebook_img:
        project.notebook_img = save_file(notebook_img)

    about = parse_json_field(about_company)
    if not about:
        raise HTTPException(status_code=400, detail="about_company is required")
    if project.about_company:
        project.about_company.title = about["title"]
        project.about_company.description = about["description"]
    else:
        project.about_company = ProjectAboutCompany(
            title=about["title"],
            description=about["description"]
        )

    del project.stages[:]
    parsed_stages = parse_json_field(stages) or []
    stage_img_names = []
    if stage_imgs:
        for img in stage_imgs:
            stage_img_names.append(save_file(img, directory=STAGES_UPLOADS_DIR))
    for idx, s in enumerate(parsed_stages):
        img_name = s.get("img")
        if not img_name and idx < len(stage_img_names):
            img_name = stage_img_names[idx]
        project.stages.append(ProjectStage(title=s["title"], description=s["description"], img=img_name))

    res = parse_json_field(result)
    if not res:
        raise HTTPException(status_code=400, detail="result is required")
    result_img_names = []
    if result_imgs:
        for img in result_imgs:
            result_img_names.append(save_file(img, directory=RESULTS_UPLOADS_DIR))
    images_meta = res.get("images") or []
    if project.result:
        del project.result.images[:]
        if images_meta:
            for idx, img in enumerate(images_meta):
                uploaded_img = result_img_names[idx] if idx < len(result_img_names) else None
                img_name = uploaded_img or img.get("img")
                img_type = "tablet" if idx == 0 else "smartphone"
                project.result.images.append(ProjectResultImage(type=img_type, img=img_name))
        else:
            for idx, img_name in enumerate(result_img_names):
                img_type = "tablet" if idx == 0 else "smartphone"
                project.result.images.append(ProjectResultImage(type=img_type, img=img_name))
        project.result.description = res["description"]
    else:
        if images_meta:
            images_list = []
            for idx, img in enumerate(images_meta):
                uploaded_img = result_img_names[idx] if idx < len(result_img_names) else None
                img_name = uploaded_img or img.get("img")
                img_type = "tablet" if idx == 0 else "smartphone"
                images_list.append(ProjectResultImage(type=img_type, img=img_name))
        else:
            images_list = [
                ProjectResultImage(
                    type=("tablet" if idx == 0 else "smartphone"),
                    img=img_name,
                )
                for idx, img_name in enumerate(result_img_names)
            ]

        project.result = ProjectResult(
            description=res["description"],
            images=images_list,
        )

    del project.progresses[:]
    for pr in parse_json_field(progress) or []:
        project.progresses.append(ProjectProgress(digit=pr["digit"], text=pr["text"]))
    session.commit()
    return {"detail": "Updated"}

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    user=Depends(role_required("admin")),
):
    project = fetch_full_project(session, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    session.delete(project)
    session.commit()
    return {"detail": "Deleted"}