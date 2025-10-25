
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="text-white space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-secondary-text">Manage your application settings and preferences.</p>
      </div>

      <div className="bg-card-bg rounded-2xl p-6 border border-border-color">
          <h3 className="text-xl font-bold text-white mb-4">Application Settings</h3>
          <p className="text-secondary-text">General application settings will be available here in a future update.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
