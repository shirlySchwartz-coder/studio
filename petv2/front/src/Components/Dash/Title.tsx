import { Bell, ChevronDown, Search } from 'lucide-react';

interface TitleProps {
  userName: string;
  userRole?: number;
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
    <div className="sidebar-profile">
      <div className="sidebar-profile-info">
        <div className="sidebar-profile-avatar">{userName.charAt(0)}</div>
        <div>
          <div className="sidebar-profile-name">{userName}</div>
          <div className="sidebar-profile-role">
            {userRole === 1
              ? 'מנהל מערכת'
              : userRole === 2
              ? 'מנהל מקלט'
              : 'משתמש'}
          </div>

          {/* Notifications */}
          <button className="sidebar-notification-btn">
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="sidebar-notification-badge">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Title;
