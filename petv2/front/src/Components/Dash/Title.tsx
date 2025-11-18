import { Bell, ChevronDown, Search } from 'lucide-react';

interface TitleProps {
  userName: string;
  userRole?: string;
  notificationCount?: number;
  onNavigate?: (page: string) => void;
  headerAction?: React.ReactNode;
  title?: string;
}

export const Title: React.FC<TitleProps> = ({
  userName,
  userRole,
  notificationCount = 0,
  headerAction,
  title,
}) => {
  return (
    <>
      <div className="sidebar-profile">
        <div className="info">
          <div className="name">{userName}</div>
          {userRole && <div className="role">{userRole}</div>}
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
          <ChevronDown size={20} style={{ color: 'var(--blue-gray)' }} />
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
      </div>
    </>
  );
};

export default Title;
