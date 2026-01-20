'use client';

import { useState, useEffect } from 'react';
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

const ProjectEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleUpdate = (updates: Partial<Project>) => {
    if (project) {
      setProject({ ...project, ...updates });
    }
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      setSaving(true);
      const id = Number(project.id);

      // Бекенд ждёт плоские строки + файлы (см. openapi: /projects/{project_id} PUT)
      const formData = new FormData();
      formData.append('title', project.title);
      formData.append('url', project.url);
      formData.append('target', project.target);
      formData.append('task', project.task);
      formData.append('about_company', JSON.stringify(project.about_company));
      formData.append('stages', JSON.stringify(project.stages));
      formData.append('result', JSON.stringify(project.result));
      // В API поле называется "progress", в моках "progess"
      formData.append('progress', JSON.stringify(project.progess));

      // TODO: когда будут реальные файлы, сюда добавятся preview_img / notebook_img / main_img

      await updateProjectOnApi(id, formData);
      // можно добавить тост / уведомление
      console.log('Проект сохранён на сервере');
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