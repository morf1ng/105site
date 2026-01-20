import { Project } from '@/lib/mockData';
import StageItem from './StageItem';

type ProjectStagesSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const ProjectStagesSection = ({ project, onUpdate }: ProjectStagesSectionProps) => {
  const fixedTitles = ['Аналитика', 'Проектирование', 'Дизайн'];

  const updateStage = (index: number, field: 'title' | 'description' | 'img', value: string) => {
    const updatedStages = [...project.stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    onUpdate({ stages: updatedStages });
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
        const isFixedTitle = index < fixedTitles.length;
        // For fixed titles, use the fixed title; for others, use the stage's title or default
        const displayStage = isFixedTitle 
          ? { ...stage, title: fixedTitles[index] }
          : { ...stage, title: stage.title || `Этап ${index + 1}` };
        
        return (
          <StageItem
            key={index}
            stage={displayStage}
            index={index}
            isEven={isEven}
            onUpdate={(field, value) => updateStage(index, field, value)}
            onRemove={() => removeStage(index)}
            isFixedTitle={isFixedTitle}
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

