import { DashboardLayout } from '../Layout/DashboardLayout';
import { Stats } from '../Components/Dash/Stats';
import { Tabs } from '../Components/Dash/Tabs';
import { useEffect, useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
}

function DashPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const userData = {
    userName: 'shirly admin',
    userRole: 'admin',
    notificationCount: 50,
    title: 'מנהלת מערכת',
  };
  const menuConfig = {
    User: [
      { icon: '🏠', label: 'דף הבית', active: true },
      { icon: '❤️', label: 'המועדפים שלי', badge: '3' },
      { icon: '📝', label: 'הבקשות שלי', badge: '1', badgeColor: 'orange' },
      { icon: '💬', label: 'הודעות', badge: '2' },
      { icon: '⚙️', label: 'העדפות חיפוש' },
      { icon: '👤', label: 'הפרופיל שלי' },
      { icon: '🚪', label: 'התנתק' /*onClick: () => onNavigate('home')*/ },
    ],
    Shelter: [
      { icon: '🏠', label: 'סקירה כללית', active: true },
      { icon: '🐾', label: 'החיות שלי', badge: '24' },
      { icon: '📋', label: 'בקשות אימוץ', badge: '8', badgeColor: 'orange' },
      { icon: '✉️', label: 'הודעות' },
      { icon: '⚙️', label: 'הגדרות' },
      { icon: '🚪', label: 'התנתק' /*onClick: () => onNavigate('home')*/ },
    ],
    Admin: [
      { icon: '📊', label: 'סקירה כללית', active: true },
      { icon: '🐾', label: 'כל החיות' },
      { icon: '✅', label: 'אישור פוסטים', badge: '12', badgeColor: 'orange' },
      { icon: '🏢', label: 'ניהול עמותות' },
      { icon: '👥', label: 'משתמשים' },
      { icon: '📝', label: 'ניהול גזעים' },
      { icon: '📈', label: 'סטטיסטיקות' },
      { icon: '⚙️', label: 'הגדרות מערכת' },
      { icon: '🚪', label: 'התנתק' /*onClick: () => onNavigate('home') */ },
    ],
  };

  useEffect(() => {
    const role = userData.userRole;

    if (role === 'user') {
      setNavItems(menuConfig.User);
    } else if (role === 'shelter') {
      setNavItems(menuConfig.Shelter);
    } else if (role === 'admin') {
      setNavItems(menuConfig.Admin);
    } else {
      setNavItems([]); // ברירת מחדל
    }
  }, [userData.userRole]);

  return (
    <DashboardLayout
      userName={userData.userName}
      userRole={userData.userRole}
      navItems={navItems}
      notificationCount={userData.notificationCount}
      title={userData.title}
    >
      <Stats userRole={userData.userRole} />
      <Tabs />
    </DashboardLayout>
  );
}

export default DashPage;
