import { Project } from '@/lib/mockData';
import { useRef, useEffect } from 'react';

type TargetTaskSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const TargetTaskSection = ({ project, onUpdate }: TargetTaskSectionProps) => {
  const targetRef = useRef<HTMLTextAreaElement>(null);
  const taskRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (targetRef.current) autoResizeTextarea(targetRef.current);
    if (taskRef.current) autoResizeTextarea(taskRef.current);
  }, [project.target, project.task]);

  const handleTargetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target);
    onUpdate({ target: e.target.value });
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target);
    onUpdate({ task: e.target.value });
  };

  return (
    <div className="target-task-section">
      <div className="target-section">
        <h2 className="section-title">ЦЕЛЬ</h2>
        <textarea
          ref={targetRef}
          value={project.target}
          onChange={handleTargetChange}
          className="target-task-textarea"
          placeholder="Текст"
          rows={1}
        />
      </div>
      <div className="task-section">
        <h2 className="section-title">ЗАДАЧА</h2>
        <textarea
          ref={taskRef}
          value={project.task}
          onChange={handleTaskChange}
          className="target-task-textarea"
          placeholder="Текст"
          rows={1}
        />
      </div>
    </div>
  );
};

export default TargetTaskSection;

