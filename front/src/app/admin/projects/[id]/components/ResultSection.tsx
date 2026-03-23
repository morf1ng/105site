import { Project } from '@/lib/mockData';
import { useRef, useEffect } from 'react';
import { compressImage } from '@/lib/imageUtils';

type ResultSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>, fileUpdates?: {
    preview_img?: File;
    main_img?: File;
    notebook_img?: File;
    stage_imgs?: { index: number; file: File }[];
    result_imgs?: { index: number; file: File }[];
  }) => void;
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

  const handleImage1Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before upload (1920px max, 90% quality - high quality)
        const compressedFile = await compressImage(file, 1920, 1920, 0.9);
        const imageUrl = URL.createObjectURL(compressedFile);
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
        }, {
          result_imgs: [{ index: 0, file: compressedFile }]
        });
      } catch (error) {
        console.error('Error processing image:', error);
        // Fallback to original file
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
        }, {
          result_imgs: [{ index: 0, file }]
        });
      }
    }
  };

  const handleImage2Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before upload (1920px max, 90% quality - high quality)
        const compressedFile = await compressImage(file, 1920, 1920, 0.9);
        const imageUrl = URL.createObjectURL(compressedFile);
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
        }, {
          result_imgs: [{ index: 1, file: compressedFile }]
        });
      } catch (error) {
        console.error('Error processing image:', error);
        // Fallback to original file
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
        }, {
          result_imgs: [{ index: 1, file }]
        });
      }
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

