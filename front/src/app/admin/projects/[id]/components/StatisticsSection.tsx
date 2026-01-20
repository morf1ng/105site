import { Project } from '@/lib/mockData';

type StatisticsSectionProps = {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
};

const StatisticsSection = ({ project, onUpdate }: StatisticsSectionProps) => {
  const updateStatistic = (index: number, field: 'stat' | 'text', value: string) => {
    const updatedProgress = [...project.progess];
    updatedProgress[index] = { ...updatedProgress[index], [field]: value };
    onUpdate({ progess: updatedProgress });
  };

  return (
    <div className="statistics-section">
      {project.progess.map((statistic, index) => (
        <div key={index} className="statistic-card">
          <input
            type="text"
            value={statistic.text}
            onChange={(e) => updateStatistic(index, 'text', e.target.value)}
            className="statistic-label-input"
            placeholder="ПОВЫШАЕМ ПРОДАЖИ НА"
          />
          <input
            type="text"
            value={statistic.stat}
            onChange={(e) => updateStatistic(index, 'stat', e.target.value)}
            className="statistic-digit"
            placeholder="40"
          />
        </div>
      ))}
    </div>
  );
};

export default StatisticsSection;

