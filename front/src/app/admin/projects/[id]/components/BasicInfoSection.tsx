import { Project } from '@/lib/mockData';
import { useRef } from 'react';

type BasicInfoSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const BasicInfoSection = ({ project, onUpdate }: BasicInfoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      onUpdate({ preview_img: imageUrl });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ url: e.target.value });
  };

  const handleUrlIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (project.url) {
      let urlToOpen = project.url;
      if (!urlToOpen.startsWith('http://') && !urlToOpen.startsWith('https://')) {
        urlToOpen = `https://${urlToOpen}`;
      }
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="basic-info-section">
      <div className="basic-info-left">
        <div className="image-upload-area" onClick={handleImageClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {project.preview_img ? (
            <img 
              src={project.preview_img} 
              alt="Project preview" 
              className="uploaded-image"
            />
          ) : (
            <>
              <svg 
                className="upload-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 16V8M12 8L8 12M12 8L16 12M4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="upload-text">Выберите изображение</span>
            </>
          )}
        </div>
      </div>
      
      <div className="basic-info-right">
        <div className="input-group">
          <input
            type="text"
            value={project.title}
            onChange={handleTitleChange}
            className="project-title-input"
            placeholder="Название проекта"
          />
        </div>
        <div className="url-input-group">
          <img 
            src="/assets/icons/link_chain.svg" 
            alt="Link" 
            className="url-icon" 
            onClick={handleUrlIconClick}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="text"
            value={project.url}
            onChange={handleUrlChange}
            className="project-url-input"
            placeholder="URL проекта"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;

