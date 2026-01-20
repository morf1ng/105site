import type { Project } from './mockData';
import type { ApiProject } from './api';

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function apiProjectToProject(api: ApiProject): Project {
  const aboutCompanyFallback = {
    title: '',
    description: typeof api.about_company === 'string' ? api.about_company : '',
  };

  const about_company = safeJsonParse<Project['about_company']>(
    api.about_company,
    aboutCompanyFallback
  );

  const stages = safeJsonParse<Project['stages']>(api.stages, []);
  const result = safeJsonParse<Project['result']>(api.result, {
    title: '',
    description: '',
    images: [],
  });

  const progess = safeJsonParse<Project['progess']>(api.progress, []);

  return {
    id: String(api.id),
    title: api.title ?? '',
    preview_img: api.preview_img ?? '',
    url: api.url ?? '',
    date: api.created_at ? new Date(api.created_at) : new Date(),
    notebook_img: api.notebook_img ?? '',
    main_img: api.main_img ?? '',
    target: api.target ?? '',
    task: api.task ?? '',
    about_company,
    stages,
    result,
    progess,
  };
}


