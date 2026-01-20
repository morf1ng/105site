import { Project } from '@/lib/mockData';
import { useRef, useEffect } from 'react';

type ResultSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const ResultSection = ({ project, onUpdate }: ResultSectionProps) => {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const image1InputRef = useRef<HTMLInputElement>(null);
  const image2InputRef = useRef<HTMLInputElement>(null);

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target);
    onUpdate({
      result: {
        ...project.result,
        description: e.target.value
      }
    });
  };

  const handleImage1Click = () => {
    image1InputRef.current?.click();
  };

  const handleImage2Click = () => {
    image2InputRef.current?.click();
  };

  const handleImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...project.result.images];
      if (updatedImages.length > 0) {
        updatedImages[0] = { ...updatedImages[0], img: imageUrl };
      } else {
        updatedImages.push({ type: 'result', img: imageUrl });
      }
      onUpdate({
        result: {
          ...project.result,
          images: updatedImages
        }
      });
    }
  };

  const handleImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...project.result.images];
      if (updatedImages.length > 1) {
        updatedImages[1] = { ...updatedImages[1], img: imageUrl };
      } else if (updatedImages.length === 1) {
        updatedImages.push({ type: 'result', img: imageUrl });
      } else {
        updatedImages.push({ type: 'result', img: imageUrl });
        updatedImages.push({ type: 'result', img: imageUrl });
      }
      onUpdate({
        result: {
          ...project.result,
          images: updatedImages
        }
      });
    }
  };

  useEffect(() => {
    if (descriptionRef.current) {
      autoResizeTextarea(descriptionRef.current);
    }
  }, [project.result.description]);

  const image1 = project.result.images[0]?.img || '';
  const image2 = project.result.images[1]?.img || '';

  return (
    <div className="result-section">
      <div className="result-header">
        <h2 className="result-title">РЕЗУЛЬТАТ</h2>
        <textarea
          ref={descriptionRef}
          value={project.result.description}
          onChange={handleDescriptionChange}
          className="result-description-textarea"
          placeholder="Результат проекта"
          rows={1}
        />
      </div>
      <div className="result-section-content">
        <div className="result-images-container">
        <div className="result-image-upload-left" onClick={handleImage1Click}>
          <input
            type="file"
            ref={image1InputRef}
            onChange={handleImage1Change}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {image1 ? (
            <img 
              src={image1} 
              alt="Result image 1" 
              className="uploaded-result-image"
            />
          ) : (
            <>
              <img 
                src="/assets/icons/upload-icon.svg" 
                alt="Upload" 
                className="result-upload-icon"
              />
              <span className="result-upload-text">Выберите изображение</span>
            </>
          )}
        </div>
        <div className="result-image-upload-right" onClick={handleImage2Click}>
          <input
            type="file"
            ref={image2InputRef}
            onChange={handleImage2Change}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {image2 ? (
            <img 
              src={image2} 
              alt="Result image 2" 
              className="uploaded-result-image"
            />
          ) : (
            <>
              <img 
                src="/assets/icons/upload-icon.svg" 
                alt="Upload" 
                className="result-upload-icon"
              />
              <span className="result-upload-text">Выберите изображения</span>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResultSection;

