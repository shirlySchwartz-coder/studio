import React from 'react';
import { Title } from './Title';

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
  userRole?: string;
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
    <div className="sidebar">
      {title && (
        <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{title}</div>
      )}
      <Title
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
        title={title}
      />
      {/* Navigation */}
      <nav className="p-4">
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              //onClick={item.onClick}
              className={item.active ? 'nav-item nav-item-active' : 'nav-item'}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge && (
                <span
                  className="badge-base"
                  style={{
                    background:
                      item.badgeColor === 'orange'
                        ? 'var(--orange)'
                        : 'var(--red)',
                    color: 'var(--white)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
