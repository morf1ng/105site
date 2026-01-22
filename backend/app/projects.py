from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request
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
        print(f"[save_file] file is None", flush=True)
        return None
    if not hasattr(file, 'filename'):
        print(f"[save_file] file has no filename attribute", flush=True)
        return None
    if not file.filename or file.filename.strip() == '':
        print(f"[save_file] file.filename is empty: '{file.filename}'", flush=True)
        return None
    target_dir = directory if directory else UPLOADS_DIR
    os.makedirs(target_dir, exist_ok=True)
    file_loc = os.path.join(target_dir, file.filename)
    print(f"[save_file] Saving {file.filename} to {file_loc}", flush=True)
    try:
        # Check if file.file exists and is readable
        if not hasattr(file, 'file'):
            print(f"[save_file] file has no 'file' attribute", flush=True)
            return None
        # Reset file pointer to beginning in case it was already read
        if hasattr(file.file, 'seek'):
            file.file.seek(0)
        with open(file_loc, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # Always return relative path from UPLOADS_DIR for consistency
        rel_path = os.path.relpath(file_loc, UPLOADS_DIR)
        result = rel_path.replace("\\", "/")
        print(f"[save_file] Successfully saved: {result}", flush=True)
        return result
    except Exception as e:
        print(f"[save_file] Error saving file: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return None

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
async def update_project(
    project_id: int,
    request: Request,
    session: Session = Depends(get_session),
    user=Depends(role_required("admin")),
):
    import sys
    print(f"[UPDATE] ===== Starting update_project for project {project_id} =====", flush=True)
    sys.stdout.flush()
    
    # Parse form manually - this gives us access to ALL fields including indexed files
    form = await request.form()
    
    # Debug: Print all form keys to see what we have
    print(f"[UPDATE] All form keys: {list(form.keys())}", flush=True)
    sys.stdout.flush()
    
    # Extract all form fields
    title = form.get("title", "")
    url = form.get("url", "")
    target = form.get("target", "")
    task = form.get("task", "")
    about_company = form.get("about_company", "{}")
    stages = form.get("stages", "[]")
    result = form.get("result", "{}")
    progress = form.get("progress", "[]")
    
    # Extract single file fields
    preview_img = form.get("preview_img")
    if not isinstance(preview_img, UploadFile):
        preview_img = None
    
    main_img = form.get("main_img")
    if not isinstance(main_img, UploadFile):
        main_img = None
    
    notebook_img = form.get("notebook_img")
    if not isinstance(notebook_img, UploadFile):
        notebook_img = None
    
    print(f"[UPDATE] Single files: preview_img={preview_img is not None}, main_img={main_img is not None}, notebook_img={notebook_img is not None}", flush=True)
    sys.stdout.flush()
    
    # Collect stage_imgs files with indexed names (stage_imgs[0], stage_imgs[1], etc.)
    stage_imgs_raw = []
    
    # Check indexed keys directly
    index = 0
    while index < 10:  # Limit to 10 files max
        key = f"stage_imgs[{index}]"
        if key in form:
            value = form[key]
            print(f"[UPDATE] Found {key}: type={type(value).__name__}, isinstance={isinstance(value, UploadFile)}, has filename={hasattr(value, 'filename')}, has file={hasattr(value, 'file')}", flush=True)
            # Use duck typing - if it has filename and file attributes, treat it as UploadFile
            if isinstance(value, UploadFile) or (hasattr(value, 'filename') and hasattr(value, 'file')):
                stage_imgs_raw.append(value)
                filename = getattr(value, 'filename', 'no filename')
                print(f"[UPDATE] Added {key}: {filename}", flush=True)
            else:
                print(f"[UPDATE] {key} is not UploadFile, it's {type(value).__name__}", flush=True)
        index += 1
    
    # Also check all form items in case keys are different
    for key, value in form.items():
        if key.startswith("stage_imgs") and key not in [f"stage_imgs[{i}]" for i in range(10)]:
            print(f"[UPDATE] Found unexpected key: {key}, type={type(value).__name__}", flush=True)
            if isinstance(value, UploadFile):
                stage_imgs_raw.append(value)
                print(f"[UPDATE] Added from iteration: {key}: {value.filename if value.filename else 'no filename'}", flush=True)
    
    # Collect result_imgs files with indexed names (result_imgs[0], result_imgs[1], etc.)
    result_imgs_raw = []
    
    # Check indexed keys directly
    index = 0
    while index < 10:  # Limit to 10 files max
        key = f"result_imgs[{index}]"
        if key in form:
            value = form[key]
            print(f"[UPDATE] Found {key}: type={type(value).__name__}, isinstance={isinstance(value, UploadFile)}, has filename={hasattr(value, 'filename')}, has file={hasattr(value, 'file')}", flush=True)
            # Use duck typing - if it has filename and file attributes, treat it as UploadFile
            if isinstance(value, UploadFile) or (hasattr(value, 'filename') and hasattr(value, 'file')):
                result_imgs_raw.append(value)
                filename = getattr(value, 'filename', 'no filename')
                print(f"[UPDATE] Added {key}: {filename}", flush=True)
            else:
                print(f"[UPDATE] {key} is not UploadFile, it's {type(value).__name__}", flush=True)
        index += 1
    
    # Also check all form items in case keys are different
    for key, value in form.items():
        if key.startswith("result_imgs") and key not in [f"result_imgs[{i}]" for i in range(10)]:
            print(f"[UPDATE] Found unexpected key: {key}, type={type(value).__name__}", flush=True)
            if isinstance(value, UploadFile):
                result_imgs_raw.append(value)
                print(f"[UPDATE] Added from iteration: {key}: {value.filename if value.filename else 'no filename'}", flush=True)
    
    print(f"[UPDATE] Collected {len(stage_imgs_raw)} stage_imgs and {len(result_imgs_raw)} result_imgs", flush=True)
    sys.stdout.flush()
    
    try:
        project = fetch_full_project(session, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Not found")
    except Exception as e:
        print(f"[ERROR] Failed to fetch project {project_id}: {str(e)}", flush=True)
        sys.stdout.flush()
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

    project.title = title
    project.url = url
    project.target = target
    project.task = task
    if preview_img:
        saved_path = save_file(preview_img)
        print(f"[UPDATE] Saved preview_img: {saved_path}")
        project.preview_img = saved_path
    if main_img:
        saved_path = save_file(main_img)
        print(f"[UPDATE] Saved main_img: {saved_path}")
        project.main_img = saved_path
    if notebook_img:
        saved_path = save_file(notebook_img)
        print(f"[UPDATE] Saved notebook_img: {saved_path}")
        project.notebook_img = saved_path

    try:
        about = parse_json_field(about_company)
        if not about:
            raise HTTPException(status_code=400, detail="about_company is required")
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Failed to parse about_company: {str(e)}")
        print(f"[ERROR] about_company value: {about_company[:200]}")  # First 200 chars
        raise HTTPException(status_code=400, detail=f"Invalid about_company format: {str(e)}")
    if project.about_company:
        project.about_company.title = about["title"]
        project.about_company.description = about["description"]
    else:
        project.about_company = ProjectAboutCompany(
            title=about["title"],
            description=about["description"]
        )

    try:
        parsed_stages = parse_json_field(stages) or []
    except Exception as e:
        print(f"[ERROR] Failed to parse stages: {str(e)}")
        print(f"[ERROR] stages value: {stages[:200]}")  # First 200 chars
        raise HTTPException(status_code=400, detail=f"Invalid stages format: {str(e)}")
    
    del project.stages[:]
    stage_img_names = []
    
    # Use the stage_imgs we collected earlier
    stage_imgs_list = stage_imgs_raw
    
    print(f"[UPDATE] Processing {len(stage_imgs_list)} stage_imgs files", flush=True)
    
    if stage_imgs_list:
        for idx, img_file in enumerate(stage_imgs_list):
            print(f"[UPDATE] Processing stage_imgs[{idx}]: filename={getattr(img_file, 'filename', 'N/A')}", flush=True)
            saved = save_file(img_file, directory=STAGES_UPLOADS_DIR)
            if saved:
                print(f"[UPDATE] Saved stage image: {saved}", flush=True)
                stage_img_names.append(saved)
            else:
                print(f"[UPDATE] Failed to save stage image - save_file returned None", flush=True)
    else:
        print(f"[UPDATE] WARNING: No stage_imgs files found!", flush=True)
    
    sys.stdout.flush()
    print(f"[UPDATE] Total stage_img_names: {len(stage_img_names)}", flush=True)
    print(f"[UPDATE] Parsed stages count: {len(parsed_stages)}", flush=True)
    sys.stdout.flush()
    
    for idx, s in enumerate(parsed_stages):
        img_name = s.get("img")
        # If stage has no img path or it's a blob URL, use uploaded file if available
        # Otherwise, keep the existing path
        if not img_name or (isinstance(img_name, str) and img_name.startswith('blob:')):
            if idx < len(stage_img_names):
                img_name = stage_img_names[idx]
                print(f"[UPDATE] Assigning uploaded image {img_name} to stage {idx}")
            else:
                img_name = None  # Explicitly set to None if no file available
                print(f"[UPDATE] Stage {idx} has no image (no uploaded file available)")
        else:
            print(f"[UPDATE] Stage {idx} keeping existing image: {img_name}")
        project.stages.append(ProjectStage(title=s["title"], description=s["description"], img=img_name))

    try:
        res = parse_json_field(result)
        if not res:
            raise HTTPException(status_code=400, detail="result is required")
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Failed to parse result: {str(e)}")
        print(f"[ERROR] result value: {result[:200]}")  # First 200 chars
        raise HTTPException(status_code=400, detail=f"Invalid result format: {str(e)}")
    result_img_names = []
    # Use the result_imgs we collected earlier
    result_imgs_list = result_imgs_raw
    
    print(f"[UPDATE] Processing {len(result_imgs_list)} result_imgs files", flush=True)
    if result_imgs_list:
        for idx, img_file in enumerate(result_imgs_list):
            print(f"[UPDATE] Processing result_imgs[{idx}]: filename={getattr(img_file, 'filename', 'N/A')}", flush=True)
            saved = save_file(img_file, directory=RESULTS_UPLOADS_DIR)
            if saved:
                print(f"[UPDATE] Saved result image: {saved}", flush=True)
                result_img_names.append(saved)
            else:
                print(f"[UPDATE] Failed to save result image - save_file returned None", flush=True)
    else:
        print(f"[UPDATE] WARNING: No result_imgs files found!", flush=True)
    print(f"[UPDATE] Total result_img_names: {len(result_img_names)}", flush=True)
    sys.stdout.flush()
    images_meta = res.get("images") or []
    print(f"[UPDATE] images_meta count: {len(images_meta)}")
    if project.result:
        del project.result.images[:]
        if images_meta:
            for idx, img in enumerate(images_meta):
                # If image has existing path, use it; otherwise use uploaded file
                existing_img = img.get("img")
                uploaded_img = result_img_names[idx] if idx < len(result_img_names) else None
                
                # Use uploaded file if available, otherwise keep existing path
                img_name = uploaded_img or existing_img
                # If existing_img is a blob URL, ignore it and use uploaded file
                if existing_img and isinstance(existing_img, str) and existing_img.startswith('blob:'):
                    img_name = uploaded_img
                
                img_type = "tablet" if idx == 0 else "smartphone"
                print(f"[UPDATE] Result image {idx}: type={img_type}, img={img_name}")
                project.result.images.append(ProjectResultImage(type=img_type, img=img_name))
        else:
            # No metadata, create images from uploaded files only
            for idx, img_name in enumerate(result_img_names):
                img_type = "tablet" if idx == 0 else "smartphone"
                print(f"[UPDATE] Result image {idx} from file only: type={img_type}, img={img_name}")
                project.result.images.append(ProjectResultImage(type=img_type, img=img_name))
        project.result.description = res["description"]
    else:
        if images_meta:
            images_list = []
            for idx, img in enumerate(images_meta):
                # If image has existing path, use it; otherwise use uploaded file
                existing_img = img.get("img")
                uploaded_img = result_img_names[idx] if idx < len(result_img_names) else None
                
                # Use uploaded file if available, otherwise keep existing path
                img_name = uploaded_img or existing_img
                # If existing_img is a blob URL, ignore it and use uploaded file
                if existing_img and isinstance(existing_img, str) and existing_img.startswith('blob:'):
                    img_name = uploaded_img
                
                img_type = "tablet" if idx == 0 else "smartphone"
                print(f"[UPDATE] New result image {idx}: type={img_type}, img={img_name}")
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

    try:
        parsed_progress = parse_json_field(progress) or []
    except Exception as e:
        print(f"[ERROR] Failed to parse progress: {str(e)}")
        print(f"[ERROR] progress value: {progress[:200]}")  # First 200 chars
        raise HTTPException(status_code=400, detail=f"Invalid progress format: {str(e)}")
    
    del project.progresses[:]
    for pr in parsed_progress:
        try:
            # Ensure digit is an integer
            digit = int(pr.get("digit", 0)) if pr.get("digit") else 0
            text = str(pr.get("text", ""))
            project.progresses.append(ProjectProgress(digit=digit, text=text))
        except (ValueError, KeyError, TypeError) as e:
            print(f"[ERROR] Invalid progress item: {pr}, error: {str(e)}")
            # Skip invalid items instead of failing
            continue
    
    try:
        session.commit()
        return {"detail": "Updated"}
    except Exception as e:
        print(f"[ERROR] Failed to commit changes: {str(e)}")
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save project: {str(e)}")

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