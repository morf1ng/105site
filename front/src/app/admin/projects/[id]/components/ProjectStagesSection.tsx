import { Project } from '@/lib/mockData';
import StageItem from './StageItem';

type ProjectStagesSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>, fileUpdates?: {
    preview_img?: File;
    main_img?: File;
    notebook_img?: File;
    stage_imgs?: { index: number; file: File }[];
    result_imgs?: { index: number; file: File }[];
  }) => void;
};

const ProjectStagesSection = ({ project, onUpdate }: ProjectStagesSectionProps) => {
  const updateStage = (index: number, field: 'title' | 'description' | 'img', value: string, file?: File) => {
    const updatedStages = [...project.stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    const fileUpdates = file ? { stage_imgs: [{ index, file }] } : undefined;
    onUpdate({ stages: updatedStages }, fileUpdates);
  };

  const removeStage = (index: number) => {
    const updatedStages = project.stages.filter((_, i) => i !== index);
    onUpdate({ stages: updatedStages });
  };

  const addStage = () => {
    const newStage = {
      title: `Этап ${project.stages.length + 1}`,
      description: '',
      img: ''
    };
    onUpdate({ stages: [...project.stages, newStage] });
  };

  return (
    <div className="project-stages-section">
      {project.stages.map((stage, index) => {
        const isEven = index % 2 === 0;
        // Use the actual stage title, with a fallback for empty titles
        const displayStage = { 
          ...stage, 
          title: stage.title || `Этап ${index + 1}` 
        };
        
        return (
          <StageItem
            key={index}
            stage={displayStage}
            index={index}
            isEven={isEven}
            onUpdate={(field, value, file) => updateStage(index, field, value, file)}
            onRemove={() => removeStage(index)}
            isFixedTitle={false}
          />
        );
      })}
      <div className="add-stage-container">
        <div className="add-stage-line"></div>
        <button className="add-stage-button" onClick={addStage}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectStagesSection;

