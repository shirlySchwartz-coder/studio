import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { Calendar } from 'lucide-react';

interface StatsProps {
  userRole: string;
}
interface StatsItem {
  icon: string;
  label: string;
  value: string;
  variant: string;
}

export const Stats: React.FC<StatsProps> = ({ userRole }) => {
  const [stats, setStats] = useState<StatsItem[]>([]);

  const statsConfig: Record<string, StatsItem[]> = {
    user: [
      {
        icon: '❤️',
        label: 'מועדפים',
        value: '12',
        variant: 'cyan',
      },
      {
        icon: '📝',
        label: 'בקשות',
        value: '3',
        variant: 'orange',
      },
    ],
    shelter: [
      {
        icon: '🐾',
        label: 'סך החיות',
        value: '1,248',
        variant: 'cyan',
      },
      {
        icon: '⏳',
        label: 'ממתינות לאישור',
        value: '3',
        variant: 'orange',
      },
      {
        icon: '✉️',
        label: 'בקשות חדשות',
        value: '8',
        variant: 'violet',
      },
      {
        icon: '💬',
        label: 'הודעות חדשות',
        value: '12',
        variant: 'mint',
      },
    ],
    admin: [
      {
        icon: '🐾',
        label: 'סה״כ חיות במערכת',
        value: '1,248',
        variant: 'cyan',
      },
      {
        icon: '👥',
        label: 'משתמשים רשומים',
        value: '856',
        variant: 'mint',
      },
      {
        icon: '🏢',
        label: 'עמותות פעילות',
        value: '25',
        variant: 'violet',
      },
      {
        icon: '🐾',
        label: 'בקשות ממתינות',
        value: '1,248',
        variant: 'orange',
      },
      {
        icon: '✅"',
        label: 'פוסטים לאישור',
        value: '12',
        variant: 'violet',
      },
      {
        icon: '❤️',
        label: 'אימוצים השבוע',
        value: '18',
        variant: 'mint',
      },
    ],
  };

  useEffect(() => {
    setStats(statsConfig[userRole] || []);
  }, [userRole]);
  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
      <p>hey</p>
      {stats.map((item, index) => (
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
