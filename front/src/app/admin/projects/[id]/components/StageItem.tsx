import { useRef, useEffect } from 'react';

type Stage = {
  title: string;
  description: string;
  img: string;
};

type StageItemProps = {
  stage: Stage;
  index: number;
  isEven: boolean;
  onUpdate: (field: 'title' | 'description' | 'img', value: string) => void;
  onRemove: () => void;
  isFixedTitle: boolean;
};

const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const StageItem = ({ stage, index, isEven, onUpdate, onRemove, isFixedTitle }: StageItemProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [stage.description]);

  const handleImageClick = () => {
    const fileInput = document.getElementById(`stage-image-${index}`) as HTMLInputElement;
    fileInput?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdate('img', imageUrl);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target);
    onUpdate('description', e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate('title', e.target.value);
  };

  return (
    <div className={`stage-item ${isEven ? 'stage-content-left' : 'stage-content-right'}`}>
      <div className="stage-content">
        <input
          type="text"
          value={stage.title}
          onChange={handleTitleChange}
          className="stage-title-input"
          placeholder="Название этапа"
        />
        <textarea
          ref={textareaRef}
          value={stage.description}
          onChange={handleDescriptionChange}
          className="stage-textarea"
          placeholder="Текст"
          rows={1}
        />
        {!isFixedTitle && (
          <button className="stage-remove-button" onClick={onRemove}>
            Удалить этап
          </button>
        )}
      </div>
      <div className="stage-image-container">
        <div 
          className="stage-image-upload" 
          onClick={handleImageClick}
        >
          <input
            type="file"
            id={`stage-image-${index}`}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {stage.img ? (
            <img 
              src={stage.img} 
              alt={`Stage ${index + 1}`} 
              className="uploaded-stage-image"
            />
          ) : (
            <>
              <img 
                src="/assets/icons/upload-icon.svg" 
                alt="Upload" 
                className="stage-upload-icon"
              />
              <span className="stage-upload-text">Выберите изображение</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StageItem;

