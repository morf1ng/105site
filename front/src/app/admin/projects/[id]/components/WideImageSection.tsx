import { Project } from '@/lib/mockData';
import { useRef } from 'react';
import { compressImage } from '@/lib/imageUtils';

type WideImageSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>, fileUpdates?: {
    preview_img?: File;
    main_img?: File;
    notebook_img?: File;
    stage_imgs?: { index: number; file: File }[];
    result_imgs?: { index: number; file: File }[];
  }) => void;
};

const WideImageSection = ({ project, onUpdate }: WideImageSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before upload (1920px max, 90% quality - high quality)
        const compressedFile = await compressImage(file, 1920, 1920, 0.9);
        // Create a local URL for preview
        const imageUrl = URL.createObjectURL(compressedFile);
        onUpdate({ main_img: imageUrl }, { main_img: compressedFile });
      } catch (error) {
        console.error('Error processing image:', error);
        // Fallback to original file
        const imageUrl = URL.createObjectURL(file);
        onUpdate({ main_img: imageUrl }, { main_img: file });
      }
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



