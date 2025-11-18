import React from 'react';
interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  variant?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  variant = 'white',
}) => {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="flex items-center justify-between">
        <span className="icon text-4xl">{icon}</span>
        <div className="text-right">
          <div className="value text-3xl font-bold">{value}</div>
          <div className="text-sm opacity-90"> {label}</div>
        </div>
      </div>
    </div>
  );
};
