import { DashboardLayout } from '../Layout/DashboardLayout';
import { Stats } from '../Components/Dash/Stats';
import { Tabs } from '../Components/Dash/Tabs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/store';
import { getReferenceData } from '../Redux/actions/animalActions';
import { NavItem } from '../Models/componentTypes';
import { StatsItem } from '../Models/componentTypes';
import { List } from '../Components/List';
import { menuConfig, statsConfig } from '../config/dashboardConfig';
import {
  fetchFavoritesCount,
  fetchMyFavorites,
} from '../Redux/actions/favoriteAction';

function DashPage() {
  const dispatch = useDispatch<AppDispatch>();

 
  const { isLoggedIn, roleId, fullName } = useSelector(
    (state: RootState) => state.auth
  );
  const { favoritesCount, favoritesList } = useSelector(
    (state: RootState) => state.favorites
  );

  const userData = {
    notificationCount: 50,
  };

  useEffect(() => {
    if (isLoggedIn && roleId) {
      dispatch(getReferenceData());
    }
  }, [dispatch, isLoggedIn, roleId]);

  useEffect(() => {
    const fetchFavoritesData = async () => {
      if (isLoggedIn && roleId === 3) {
        await dispatch(fetchFavoritesCount());
        await dispatch(fetchMyFavorites());
      }
    };
    fetchFavoritesData();
  }, [dispatch, isLoggedIn, roleId]);
  
  const navItems =
    roleId && isLoggedIn
      ? menuConfig[roleId]?.map((item) =>
          item.label === 'המועדפים שלי'
            ? {
                ...item,
                badge: favoritesCount > 0 ? String(favoritesCount) : undefined,
              }
            : item
        ) || menuConfig[3]
      : [];

      
 const getStatsItems = (): StatsItem[] => {
   if (roleId === 3 && isLoggedIn) {
     return (statsConfig[roleId] || statsConfig[3]).map((item: StatsItem) => {
       if (item.label === 'מועדפים') {
         return { ...item, value: String(favoritesCount) };
       }
       return item;
     });
   }
   return [];
 };
  const statsItems = getStatsItems();
 
  return (
    <DashboardLayout
      userName={fullName}
      userRole={roleId ?? 3}
      navItems={navItems}
      notificationCount={userData.notificationCount}
      title={roleId === 1 ? 'מנהל מערכת' : roleId === 2 ? 'מנהל מקלט' : 'משתמש'}
    >
      <Stats userRole={roleId ?? 3} statsItems={statsItems} />
      {roleId === 3 ? <List /> : <Tabs />}
    </DashboardLayout>
  );
}

export default DashPage;
