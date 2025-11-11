import React from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout/DashboardLayout';

function Dashboard() {
  return (
    <div>
      <DashboardLayout
        userName="John Doe"
        userRole="Admin"
        navItems={[
          { icon: 'home', label: 'Home', active: true },
          { icon: 'pets', label: 'Pets' },
          { icon: 'settings', label: 'Settings' },
        ]}
        onNavigate={(page) => console.log(`Navigating to ${page}`)}
        notificationCount={5}
      >
        <h1>Welcome to the Dashboard</h1>
      </DashboardLayout>
    </div>
  );
}

export default Dashboard;
