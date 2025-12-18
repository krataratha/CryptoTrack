import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'ct_settings_v1';

const defaultSettings = {
  'Display & Theme': {
    'Dark Mode': true,
    'Compact View': false,
    'Show Price Decimals': true,
    'Color Scheme': 'Cyan',
  },
  'Data & Updates': {
    'Live Price Updates': true,
    'AI Insights': true,
    'Auto-Refresh': true,
    'Update Interval': 'Every 3 seconds',
  },
  Notifications: {
    'Push Notifications': true,
    'Email Alerts': false,
    'Sound Alerts': true,
    'Notification Volume': 75,
  },
  'Privacy & Security': {
    'Encrypt Sensitive Data': true,
    'Hide Balances': false,
    'API Key Protection': true,
    'Session Timeout': '30 minutes',
  },
  Advanced: {
    'Developer Mode': false,
    'Beta Features': false,
    'Performance Mode': false,
  },
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    // Merge with defaults to ensure all keys exist
    const merged = { ...defaultSettings };
    Object.keys(parsed).forEach(section => {
      if (merged[section]) {
        merged[section] = { ...merged[section], ...parsed[section] };
      }
    });
    return merged;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

const SettingsContext = createContext({
  settings: defaultSettings,
  updateSetting: () => {},
  resetSettings: () => {},
  getSetting: () => null,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Apply theme settings
  useEffect(() => {
    const dark = settings?.['Display & Theme']?.['Dark Mode'];
    const compact = settings?.['Display & Theme']?.['Compact View'];
    const colorScheme = settings?.['Display & Theme']?.['Color Scheme'];
    const hideBalances = settings?.['Privacy & Security']?.['Hide Balances'];
    const liveUpdates = settings?.['Data & Updates']?.['Live Price Updates'];
    
    // Apply dark mode
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply compact view
    if (compact) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
    
    // Apply color scheme
    if (colorScheme) {
      document.documentElement.setAttribute('data-theme', colorScheme.toLowerCase());
    }
    
    // Apply data attributes for other settings
    document.documentElement.setAttribute('data-hide-balances', hideBalances ? 'true' : 'false');
    document.documentElement.setAttribute('data-live-updates', liveUpdates ? 'true' : 'false');
    
    console.log('Settings applied:', {
      dark,
      compact,
      colorScheme,
      hideBalances,
      liveUpdates
    });
  }, [settings]);

  function updateSetting(section, key, value) {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }

  function getSetting(section, key) {
    return settings?.[section]?.[key];
  }

  const value = {
    settings,
    updateSetting,
    resetSettings,
    getSetting,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
