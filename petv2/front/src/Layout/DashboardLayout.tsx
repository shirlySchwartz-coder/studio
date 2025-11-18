import { SideBar } from '../Components/Dash/SideBar';
import '../styles/dashboard.css';

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
  onNavigate?: (page: string) => void;
  headerAction?: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName,
  userRole,
  navItems,
  notificationCount,
  title,
}) => {
  return (
    <div className="dash-container min-h-screen flex flex-col">
      <aside>
        <SideBar
          {...{ userName, userRole, navItems, notificationCount, title }}
        />
      </aside>
      <main className="content p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};
