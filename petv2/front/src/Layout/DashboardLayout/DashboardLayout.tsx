import React from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';

interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole?: string;
  navItems: NavItem[];
  notificationCount?: number;
  onNavigate: (page: string) => void;
  headerAction?: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName,
  userRole,
  navItems,
  notificationCount = 0,
  onNavigate,
  headerAction,
  title,
}) => {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-light)' }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block fixed right-0 top-0 bottom-0 overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate?.('home')}
          >
            <span className="text-2xl">🐾</span>
            <span
              className="text-xl"
              style={{ fontWeight: 700, color: 'var(--navy)' }}
            >
              Pet-Net
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={
                  item.active ? 'nav-item nav-item-active' : 'nav-item'
                }
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:mr-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* User info */}
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="text-right">
                    <p style={{ fontWeight: 600, color: 'var(--navy)' }}>
                      {userName}
                    </p>
                    {userRole && (
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--blue-gray)',
                        }}
                      >
                        {userRole}
                      </p>
                    )}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)',
                    }}
                  >
                    <span className="text-white" style={{ fontWeight: 600 }}>
                      {userName.charAt(0)}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    style={{ color: 'var(--blue-gray)' }}
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell size={20} style={{ color: 'var(--navy)' }} />
                  {notificationCount > 0 && (
                    <span
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: 'var(--red)',
                        color: 'var(--white)',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                      }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Search */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'var(--blue-gray)' }}
                    />
                    <input
                      type="text"
                      placeholder="חפש..."
                      className="pr-10 pl-4 py-2 border rounded-lg"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--bg-light)',
                        minWidth: '300px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Title and Action */}
              <div className="flex items-center gap-4">
                {headerAction}
                {title && (
                  <h1 style={{ fontWeight: 600, color: 'var(--navy)' }}>
                    {title}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
