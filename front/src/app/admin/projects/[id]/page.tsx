'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './page.css';
import type { Project } from '@/lib/mockData';
import { BasicInfoSection, AboutCompanySection, TargetTaskSection, WideImageSection, ProjectStagesSection, ResultSection, StatisticsSection } from './components';
import { fetchProjectFromApi, updateProjectOnApi } from '@/lib/api';
import { apiProjectToProject } from '@/lib/projectAdapter';

import {getProjectById} from '@/lib/mockData'
import React from 'react';
// import {
//   ImagesSection,
//   StagesSection,
//   ResultSection,
//   ProgressSection
// } from './components';

// Helper to extract original path from getImageUrl result
// getImageUrl converts paths like "stages/image.jpg" to "/uploads/stages/image.jpg" or full URLs
// This function extracts back to the original format expected by backend
function extractOriginalPath(imageUrl: string): string | null {
  if (!imageUrl || imageUrl.startsWith('blob:')) {
    return null;
  }
  
  // Remove protocol and host (e.g., "http://localhost:8000")
  let path = imageUrl.replace(/^https?:\/\/[^\/]+/, '');
  
  // Remove /uploads/ prefix if present
  path = path.replace(/^\/uploads\//, '');
  
  // Remove leading slash if still present
  path = path.replace(/^\//, '');
  
  return path || null;
}

const ProjectEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Track File objects for images
  const imageFilesRef = useRef<{
    preview_img?: File;
    main_img?: File;
    notebook_img?: File;
    stage_imgs?: File[];
    result_imgs?: File[];
  }>({});

  useEffect(() => {
    const id = params!.id as string;
    if (!id) return;

    const load = async () => {
      try {
        const apiProject = await fetchProjectFromApi(Number(id));
        const mapped = apiProjectToProject(apiProject);
        setProject(mapped);
      } catch (e) {
        console.error('Не удалось загрузить проект из API', e);
        setProject(getProjectById("1"));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [params]);

  const handleUpdate = (updates: Partial<Project>, fileUpdates?: {
    preview_img?: File;
    main_img?: File;
    notebook_img?: File;
    stage_imgs?: { index: number; file: File }[];
    result_imgs?: { index: number; file: File }[];
  }) => {
    if (project) {
      setProject({ ...project, ...updates });
      
      // Update File objects
      if (fileUpdates) {
        if (fileUpdates.preview_img !== undefined) {
          imageFilesRef.current.preview_img = fileUpdates.preview_img;
        }
        if (fileUpdates.main_img !== undefined) {
          imageFilesRef.current.main_img = fileUpdates.main_img;
        }
        if (fileUpdates.notebook_img !== undefined) {
          imageFilesRef.current.notebook_img = fileUpdates.notebook_img;
        }
        if (fileUpdates.stage_imgs) {
          if (!imageFilesRef.current.stage_imgs) {
            imageFilesRef.current.stage_imgs = [];
          }
          fileUpdates.stage_imgs.forEach(({ index, file }) => {
            imageFilesRef.current.stage_imgs![index] = file;
          });
        }
        if (fileUpdates.result_imgs) {
          if (!imageFilesRef.current.result_imgs) {
            imageFilesRef.current.result_imgs = [];
          }
          fileUpdates.result_imgs.forEach(({ index, file }) => {
            imageFilesRef.current.result_imgs![index] = file;
          });
        }
      }
    }
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      setSaving(true);
      const id = Number(project.id);

      // Validate required fields
      const titleValue = String(project.title || '').trim();
      const urlValue = String(project.url || '').trim();
      
      if (!titleValue) {
        alert('Название проекта обязательно');
        setSaving(false);
        return;
      }
      if (!urlValue) {
        alert('URL проекта обязателен');
        setSaving(false);
        return;
      }

      // Бекенд ждёт плоские строки + файлы (см. openapi: /projects/{project_id} PUT)
      const formData = new FormData();
      formData.append('title', titleValue);
      formData.append('url', urlValue);
      formData.append('target', String(project.target || '').trim());
      formData.append('task', String(project.task || '').trim());
      
      // Ensure about_company is valid - must have title and description
      const aboutCompany = {
        title: String(project.about_company?.title || ''),
        description: String(project.about_company?.description || '')
      };
      formData.append('about_company', JSON.stringify(aboutCompany));
      
      // For stages, preserve existing image paths if no new file was uploaded
      const stagesWithPaths = (project.stages || []).map((stage, index) => {
        const hasNewFile = imageFilesRef.current.stage_imgs?.[index];
        // If there's a new file, don't include img path (backend will use uploaded file)
        // If no new file and img is not a blob URL, extract and keep the existing path
        const stageData: { title: string; description: string; img?: string } = {
          title: String(stage?.title || ''),
          description: String(stage?.description || '')
        };
        
        if (hasNewFile) {
          // New file will be uploaded, don't include img path
        } else if (stage?.img) {
          const originalPath = extractOriginalPath(stage.img);
          if (originalPath) {
            stageData.img = originalPath;
          }
        }
        return stageData;
      });
      formData.append('stages', JSON.stringify(stagesWithPaths));
      
      // For result images, preserve existing paths if no new file was uploaded
      const resultImagesWithPaths = (project.result?.images || []).map((img, index) => {
        const hasNewFile = imageFilesRef.current.result_imgs?.[index];
        if (hasNewFile) {
          // New file will be uploaded, don't include img path
          return { type: img.type || (index === 0 ? 'tablet' : 'smartphone') };
        } else if (img.img) {
          // Extract original path from full URL or relative path
          const originalPath = extractOriginalPath(img.img);
          if (originalPath) {
            return { type: img.type || (index === 0 ? 'tablet' : 'smartphone'), img: originalPath };
          }
        }
        // If no image and no new file, still include type
        return { type: img.type || (index === 0 ? 'tablet' : 'smartphone') };
      });
      // Ensure result is valid - backend expects description and images (NOT title)
      // Remove title field completely as backend doesn't expect it
      const resultData: { description: string; images: Array<{ type: string; img?: string }> } = {
        description: String(project.result?.description || project.result?.title || ''),
        images: resultImagesWithPaths
      };
      formData.append('result', JSON.stringify(resultData));
      
      // В API поле называется "progress", в моках "progess"
      const progressData = (project.progess || []).map(p => {
        // Handle both 'stat' (from mockData) and 'digit' (from API) formats
        const pAny = p as any; // Type assertion to handle both formats
        const digit = pAny.digit !== undefined ? Number(pAny.digit) : 
                     pAny.stat !== undefined ? Number(pAny.stat) : 0;
        return {
          digit: isNaN(digit) ? 0 : digit,
          text: String(p.text || '')
        };
      });
      formData.append('progress', JSON.stringify(progressData));
      
      // Debug: Log what we're sending
      console.log('[Save] FormData contents:');
      console.log('  title:', titleValue);
      console.log('  url:', urlValue);
      console.log('  about_company:', JSON.stringify(aboutCompany));
      console.log('  stages:', JSON.stringify(stagesWithPaths));
      console.log('  result:', JSON.stringify(resultData));
      console.log('  progress:', JSON.stringify(progressData));

      // Add image files if they exist
      let totalSize = 0;
      if (imageFilesRef.current.preview_img) {
        totalSize += imageFilesRef.current.preview_img.size;
        console.log(`[Save] Adding preview_img: ${(imageFilesRef.current.preview_img.size / 1024).toFixed(2)}KB`);
        formData.append('preview_img', imageFilesRef.current.preview_img);
      }
      if (imageFilesRef.current.main_img) {
        totalSize += imageFilesRef.current.main_img.size;
        console.log(`[Save] Adding main_img: ${(imageFilesRef.current.main_img.size / 1024).toFixed(2)}KB`);
        formData.append('main_img', imageFilesRef.current.main_img);
      }
      if (imageFilesRef.current.notebook_img) {
        totalSize += imageFilesRef.current.notebook_img.size;
        console.log(`[Save] Adding notebook_img: ${(imageFilesRef.current.notebook_img.size / 1024).toFixed(2)}KB`);
        formData.append('notebook_img', imageFilesRef.current.notebook_img);
      }
      
      // Add stage images with indexed names so FastAPI can parse them
      if (imageFilesRef.current.stage_imgs) {
        imageFilesRef.current.stage_imgs.forEach((file, index) => {
          if (file) {
            totalSize += file.size;
            console.log(`[Save] Adding stage_imgs[${index}]: ${(file.size / 1024).toFixed(2)}KB`);
            // Use indexed name so FastAPI can parse multiple files
            formData.append(`stage_imgs[${index}]`, file);
          }
        });
      }
      
      // Add result images with indexed names so FastAPI can parse them
      if (imageFilesRef.current.result_imgs) {
        imageFilesRef.current.result_imgs.forEach((file, index) => {
          if (file) {
            totalSize += file.size;
            console.log(`[Save] Adding result_imgs[${index}]: ${(file.size / 1024).toFixed(2)}KB`);
            // Use indexed name so FastAPI can parse multiple files
            formData.append(`result_imgs[${index}]`, file);
          }
        });
      }
      
      console.log(`[Save] Total image size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      
      // Warn if total size is very large
      if (totalSize > 10 * 1024 * 1024) { // 10MB
        console.warn(`[Save] Warning: Total image size is ${(totalSize / 1024 / 1024).toFixed(2)}MB, which may cause issues`);
      }

      await updateProjectOnApi(id, formData);
      // можно добавить тост / уведомление
      console.log('Проект сохранён на сервере');
      
      // Clear file references after successful save
      imageFilesRef.current = {};
    } catch (e) {
      console.error('Ошибка при сохранении проекта', e);
      // здесь можно повесить отображение ошибки пользователю
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/projects');
  };

  if (loading) {
    return (
      <div className="project-edit-container">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-edit-container">
        <div>Проект не найден</div>
      </div>
    );
  }

  return (
    <div className="project-edit-container">
      <div className="header-navbar">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="header-title">{project.title || 'Строительная компания'}</span>
        </div>
        <button className="save-button" onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="project-view">
        <BasicInfoSection project={project} onUpdate={handleUpdate} />
        <div className="company-target-wrapper">
          <AboutCompanySection project={project} onUpdate={handleUpdate} />
          <TargetTaskSection project={project} onUpdate={handleUpdate} />
        </div>
        <WideImageSection project={project} onUpdate={handleUpdate} />
        <ProjectStagesSection project={project} onUpdate={handleUpdate} />
        <ResultSection project={project} onUpdate={handleUpdate} />
        <StatisticsSection project={project} onUpdate={handleUpdate} />
        {/* <ImagesSection project={project} onUpdate={handleUpdate} /> */}
      </div>
    </div>
  );
};

export default ProjectEditPage;