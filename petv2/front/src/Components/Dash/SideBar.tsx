import React from 'react';
import { Title } from './Title';
import { cn } from '../Ui/utils';

interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
  onClick?: () => void;
}

interface SideBarProps {
  userName: string;
  userRole?: number;
  navItems: NavItem[];
  notificationCount?: number;
  title?: string;
}

export const SideBar: React.FC<SideBarProps> = ({
  userName,
  userRole,
  navItems,
  notificationCount = 0,
  title,
}) => {
  return (
    <div className="sidebar-right">
      <Title
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
        title={title}
      />
      {/* Navigation */}
      {navItems.map((item, index) => (
        <div
          key={item.label}
          className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
        >
          <span style={{ fontSize: '24px' }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && <span className="badge">{item.badge}</span>}
        </div>
      ))}
    </div>
  );
};
