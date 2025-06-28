import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { UserProfile } from '../components/UserProfile';

export const UserSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="User Settings" 
        subtitle="Manage your profile and account settings"
        showBackButton={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        <UserProfile />
      </main>
    </div>
  );
};

export default UserSettings; 