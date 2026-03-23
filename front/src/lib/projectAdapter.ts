import type { Project } from './mockData';
import type { ApiProject } from './api';
import { getImageUrl } from './api';

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
  // Backend returns about_company as object, not JSON string
  let about_company: Project['about_company'];
  if (typeof api.about_company === 'string') {
    about_company = safeJsonParse<Project['about_company']>(
      api.about_company,
      { title: '', description: '' }
    );
  } else if (api.about_company && typeof api.about_company === 'object') {
    about_company = {
      title: (api.about_company as any).title || '',
      description: (api.about_company as any).description || ''
    };
  } else {
    about_company = { title: '', description: '' };
  }

  // Backend returns stages as array, not JSON string
  let stages: Project['stages'];
  if (typeof api.stages === 'string') {
    stages = safeJsonParse<Project['stages']>(api.stages, []);
  } else if (Array.isArray(api.stages)) {
    stages = api.stages;
  } else {
    stages = [];
  }
  
  stages = stages.map(stage => {
    // Handle both null and empty string cases
    const imgPath = stage?.img;
    if (imgPath && imgPath.trim() !== '') {
      const convertedUrl = getImageUrl(imgPath);
      console.log(`[Adapter] Converting stage image: "${imgPath}" -> "${convertedUrl}"`);
      return {
        ...stage,
        img: convertedUrl
      };
    }
    console.log(`[Adapter] Stage image is empty or null: "${imgPath}"`);
    return {
      ...stage,
      img: ''
    };
  });
  
  // Backend returns result as object, not JSON string
  let result: Project['result'];
  if (typeof api.result === 'string') {
    const resultData = safeJsonParse<Project['result']>(api.result, {
      title: '',
      description: '',
      images: [],
    });
    result = {
      ...resultData,
      images: resultData.images.map(img => ({
        ...img,
        img: img.img ? getImageUrl(img.img) : ''
      }))
    };
  } else if (api.result && typeof api.result === 'object') {
    const resultObj = api.result as any;
    result = {
      title: '', // Backend doesn't return title
      description: resultObj.description || '',
      images: (resultObj.images || []).map((img: any) => {
        // Handle both null and empty string cases
        const imgPath = img?.img;
        if (imgPath && imgPath.trim() !== '') {
          const convertedUrl = getImageUrl(imgPath);
          console.log(`[Adapter] Converting result image: "${imgPath}" -> "${convertedUrl}"`);
          return {
            type: img.type || 'result',
            img: convertedUrl
          };
        }
        console.log(`[Adapter] Result image is empty or null: "${imgPath}"`);
        return {
          type: img.type || 'result',
          img: ''
        };
      })
    };
  } else {
    result = {
      title: '',
      description: '',
      images: []
    };
  }

  // Backend returns progress as array, not JSON string
  let progess: Project['progess'];
  if (typeof api.progress === 'string') {
    progess = safeJsonParse<Project['progess']>(api.progress, []);
  } else if (Array.isArray(api.progress)) {
    progess = api.progress.map((p: any) => ({
      stat: String(p.digit || p.stat || ''),
      text: String(p.text || '')
    }));
  } else {
    progess = [];
  }

  return {
    id: String(api.id),
    title: api.title ?? '',
    preview_img: api.preview_img ? getImageUrl(api.preview_img) : '',
    url: api.url ?? '',
    date: api.created_at ? new Date(api.created_at) : new Date(),
    notebook_img: api.notebook_img ? getImageUrl(api.notebook_img) : '',
    main_img: api.main_img ? getImageUrl(api.main_img) : '',
    target: api.target ?? '',
    task: api.task ?? '',
    about_company,
    stages,
    result,
    progess,
  };
}


