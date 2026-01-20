import { Project } from '@/lib/mockData';
import { useRef } from 'react';

type WideImageSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const WideImageSection = ({ project, onUpdate }: WideImageSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      onUpdate({ main_img: imageUrl });
    }
  };

  return (
    <div className="wide-image-section">
      <div className="wide-image-upload-area" onClick={handleImageClick}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {project.main_img ? (
          <img 
            src={project.main_img} 
            alt="Main image" 
            className="uploaded-wide-image"
          />
        ) : (
          <>
            <img 
              src="/assets/icons/upload-icon.svg" 
              alt="Upload" 
              className="wide-upload-icon"
            />
            <span className="wide-upload-text">Выберите изображение</span>
          </>
        )}
      </div>
    </div>
  );
};

export default WideImageSection;



