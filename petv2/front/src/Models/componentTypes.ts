export interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
  onClick?: () => void;
}
export interface StatsItem {
  icon: string;
  label: string;
  value: string;
  variant: string;
}
