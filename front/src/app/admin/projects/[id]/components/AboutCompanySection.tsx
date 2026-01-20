import { Project } from '@/lib/mockData';
import { useRef, useEffect } from 'react';

type AboutCompanySectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const AboutCompanySection = ({ project, onUpdate }: AboutCompanySectionProps) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) autoResizeTextarea(titleRef.current);
    if (descriptionRef.current) autoResizeTextarea(descriptionRef.current);
  }, [project.about_company.title, project.about_company.description]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target);
    onUpdate({
      about_company: {
        ...project.about_company,
        title: e.target.value
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target);
    onUpdate({
      about_company: {
        ...project.about_company,
        description: e.target.value
      }
    });
  };

  return (
    <div className="about-company-section">
      <h2 className="section-title">О КОМПАНИИ</h2>
      <div className="section-content">
        <textarea
          ref={titleRef}
          value={project.about_company.title}
          onChange={handleTitleChange}
          className="company-textarea"
          placeholder="Напишите о компании"
          rows={1}
        />
        <textarea
          ref={descriptionRef}
          value={project.about_company.description}
          onChange={handleDescriptionChange}
          className="company-textarea"
          placeholder="Подробности о компании"
          rows={1}
        />
      </div>
    </div>
  );
};

export default AboutCompanySection;

