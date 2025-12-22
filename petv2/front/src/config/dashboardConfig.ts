import { NavItem, StatsItem } from '../Models/componentTypes';

export const menuConfig: Record<number, NavItem[]> = {
  1: [
    { icon: '🏠', label: 'סקירה כללית', active: true },
    { icon: '🐾', label: 'כל החיות', badge: '5' },
    { icon: '✅', label: 'אישור פוסטים', badge: '12', badgeColor: 'orange' },
    { icon: '🏢', label: 'ניהול עמותות' },
    { icon: '👥', label: 'משתמשים' },
    { icon: '📝', label: 'ניהול גזעים' },
    { icon: '📈', label: 'סטטיסטיקות' },
    { icon: '⚙️', label: 'הגדרות מערכת' },
    { icon: '🚪', label: 'התנתק' },
  ],
  2: [
    { icon: '🏠', label: 'סקירה כללית', active: true },
    { icon: '🐾', label: 'החיות שלי', badge: '24' },
    { icon: '📋', label: 'בקשות אימוץ', badge: '8', badgeColor: 'orange' },
    { icon: '✉️', label: 'הודעות' },
    { icon: '⚙️', label: 'הגדרות' },
    { icon: '🚪', label: 'התנתק' },
  ],
  3: [
    { icon: '🏠', label: 'דף הבית', active: true },
    { icon: '❤️', label: 'המועדפים שלי' }, // badge יתווסף דינמית
    { icon: '📝', label: 'הבקשות שלי', badge: '110', badgeColor: 'orange' },
    { icon: '💬', label: 'הודעות', badge: '200' },
    { icon: '⚙️', label: 'העדפות חיפוש' },
    { icon: '👤', label: 'הפרופיל שלי' },
    { icon: '🚪', label: 'התנתק' },
  ],
};

export const statsConfig: Record<number, StatsItem[]> = {
  1: [
    {
      icon: '🐾',
      label: 'סה״כ חיות במערכת',
      value: '1,248',
      variant: 'orange',
    },
    { icon: '👥', label: 'משתמשים רשומים', value: '856', variant: 'mint' },
    { icon: '🏢', label: 'עמותות פעילות', value: '25', variant: 'violet' },
    { icon: '🐾', label: 'בקשות ממתינות', value: '1,248', variant: 'orange' },
    { icon: '✅', label: 'פוסטים לאישור', value: '12', variant: 'cyan' },
    { icon: '❤️', label: 'אימוצים השבוע', value: '18', variant: 'mint' },
  ],
  2: [
    { icon: '🐾', label: 'סך החיות', value: '1,248', variant: 'cyan' },
    { icon: '⏳', label: 'ממתינות לאישור', value: '3', variant: 'orange' },
    { icon: '✉️', label: 'בקשות חדשות', value: '8', variant: 'violet' },
    { icon: '💬', label: 'הודעות חדשות', value: '12', variant: 'mint' },
  ],
  3: [
    { icon: '❤️', label: 'מועדפים', value: '12', variant: 'cyan' },
    { icon: '📝', label: 'בקשות', value: '15', variant: 'orange' },
  ],
};
