import { DashboardLayout } from '../Layout/DashboardLayout';
import { Stats } from '../Components/Dash/Stats';
import { Tabs } from '../Components/Dash/Tabs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/store';
import { getReferenceData } from '../Redux/actions/animalActions';

interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
}
interface StatsItem {
  icon: string;
  label: string;
  value: string;
  variant: string;
}

function DashPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [statsItems, setStatsItems] = useState<StatsItem[]>([]);
  const { isLoggedIn, roleId, fullName } = useSelector(
    (state: RootState) => state.auth
  );

  const userData = {
    notificationCount: 50,
  };
  const menuConfig: Record<number, NavItem[]> = {
    1: [
      { icon: '🏠', label: 'סקירה כללית', active: true },
      { icon: '🐾', label: 'כל החיות', badge: '5' },
      { icon: '✅', label: 'אישור פוסטים', badge: '12', badgeColor: 'orange' },
      { icon: '🏢', label: 'ניהול עמותות' },
      { icon: '👥', label: 'משתמשים' },
      { icon: '📝', label: 'ניהול גזעים' },
      { icon: '📈', label: 'סטטיסטיקות' },
      { icon: '⚙️', label: 'הגדרות מערכת' },
      { icon: '🚪', label: 'התנתק' /*onClick: () => onNavigate('home') */ },
    ],
    2: [
      { icon: '🏠', label: 'סקירה כללית', active: true },
      { icon: '🐾', label: 'החיות שלי', badge: '24' },
      { icon: '📋', label: 'בקשות אימוץ', badge: '8', badgeColor: 'orange' },
      { icon: '✉️', label: 'הודעות' },
      { icon: '⚙️', label: 'הגדרות' },
      { icon: '🚪', label: 'התנתק' /*onClick: () => onNavigate('home')*/ },
    ],
    3: [
      { icon: '🏠', label: 'דף הבית', active: true },
      { icon: '❤️', label: 'המועדפים שלי', badge: '3' },
      { icon: '📝', label: 'הבקשות שלי', badge: '1', badgeColor: 'orange' },
      { icon: '💬', label: 'הודעות', badge: '2' },
      { icon: '⚙️', label: 'העדפות חיפוש' },
      { icon: '👤', label: 'הפרופיל שלי' },
      { icon: '🚪', label: 'התנתק' /*onClick: () => onNavigate('home')*/ },
    ],
  };
  const statsConfig: Record<number, StatsItem[]> = {
    1: [
      {
        icon: '🐾',
        label: 'סה״כ חיות במערכת',
        value: '1,248',
        variant: 'orange',
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
        icon: '✅',
        label: 'פוסטים לאישור',
        value: '12',
        variant: 'cyan',
      },
      {
        icon: '❤️',
        label: 'אימוצים השבוע',
        value: '18',
        variant: 'mint',
      },
    ],
    2: [
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
    3: [
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
  };

  useEffect(() => {
    if (roleId == null || !isLoggedIn) {
      setNavItems([]);
      setStatsItems([]);
      return;
    }
    const r = roleId;
    setNavItems(menuConfig[r] || menuConfig[3]); // fallback ל-user רגיל
    setStatsItems(statsConfig[r] || statsConfig[3]);
  }, [roleId, isLoggedIn]);
  useEffect(() => {
    if (roleId && isLoggedIn) {
      dispatch(getReferenceData()); // טעינה גלובלית – פעם אחת
    }
  }, [dispatch, roleId, isLoggedIn]);

  if (!isLoggedIn || !fullName) {
    return <div>טוען...</div>;
  }

  return (
    <DashboardLayout
      userName={fullName}
      userRole={roleId ?? 3}
      navItems={navItems}
      notificationCount={userData.notificationCount}
      title={roleId === 1 ? 'מנהל מערכת' : roleId === 2 ? 'מנהל מקלט' : 'משתמש'}
    >
      <Stats userRole={roleId ?? 3} statsItems={statsItems} />
      <Tabs />
    </DashboardLayout>
  );
}

export default DashPage;
