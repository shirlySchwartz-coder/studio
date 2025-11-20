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
      <span className="stat-card-icon">{icon}</span>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label"> {label}</div>
    </div>
  );
};
