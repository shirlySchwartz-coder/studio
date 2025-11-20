import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { Calendar } from 'lucide-react';

interface StatsItem {
  icon: string;
  label: string;
  value: string;
  variant: string;
}
interface StatsProps {
  userRole: number;
  statsItems: StatsItem[];
}

export const Stats: React.FC<StatsProps> = ({ userRole, statsItems }) => {
  return (
    <div className="stats-grid">
      {statsItems.map((item, index) => (
        <StatCard
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
          variant={item.variant}
        />
      ))}
    </div>
  );
};
