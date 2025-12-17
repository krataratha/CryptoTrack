import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Lock, Eye, Zap, Sliders, HelpCircle } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

const STORAGE_KEY = 'ct_settings_v1'

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
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export default function SettingsPage() {
  const [settingsState, setSettingsState] = useState(() => loadSettings())

  useEffect(() => {
    saveSettings(settingsState)
  }, [settingsState])

  useEffect(() => {
    const dark = settingsState['Display & Theme']['Dark Mode']
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settingsState])

  const settingsSections = useMemo(() => [
    {
      title: 'Display & Theme',
      icon: Moon,
      settings: [
        {
          label: 'Dark Mode',
          description: 'Use dark theme for the dashboard',
          type: 'toggle',
          path: ['Display & Theme', 'Dark Mode'],
        },
        {
          label: 'Compact View',
          description: 'Reduce spacing and font sizes',
          type: 'toggle',
          path: ['Display & Theme', 'Compact View'],
        },
        {
          label: 'Show Price Decimals',
          description: 'Display full price precision',
          type: 'toggle',
          path: ['Display & Theme', 'Show Price Decimals'],
        },
        {
          label: 'Color Scheme',
          description: 'Choose your preferred color theme',
          type: 'select',
          options: ['Cyan', 'Purple', 'Green', 'Orange'],
          path: ['Display & Theme', 'Color Scheme'],
        },
      ],
    },
    {
      title: 'Data & Updates',
      icon: Zap,
      settings: [
        {
          label: 'Live Price Updates',
          description: 'Real-time price feeds (3 sec intervals)',
          type: 'toggle',
          path: ['Data & Updates', 'Live Price Updates'],
        },
        {
          label: 'AI Insights',
          description: 'Enable AI-generated market narratives',
          type: 'toggle',
          path: ['Data & Updates', 'AI Insights'],
        },
        {
          label: 'Auto-Refresh',
          description: 'Automatically refresh data',
          type: 'toggle',
          path: ['Data & Updates', 'Auto-Refresh'],
        },
        {
          label: 'Update Interval',
          description: 'Choose refresh frequency',
          type: 'select',
          options: ['Every 3 seconds', 'Every 10 seconds', 'Every 30 seconds', 'Manual'],
          path: ['Data & Updates', 'Update Interval'],
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          label: 'Push Notifications',
          description: 'Send desktop notifications',
          type: 'toggle',
          path: ['Notifications', 'Push Notifications'],
        },
        {
          label: 'Email Alerts',
          description: 'Receive email notifications',
          type: 'toggle',
          path: ['Notifications', 'Email Alerts'],
        },
        {
          label: 'Sound Alerts',
          description: 'Play sound for price alerts',
          type: 'toggle',
          path: ['Notifications', 'Sound Alerts'],
        },
        {
          label: 'Notification Volume',
          description: 'Volume level for alerts',
          type: 'slider',
          path: ['Notifications', 'Notification Volume'],
          min: 0,
          max: 100,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      settings: [
        {
          label: 'Encrypt Sensitive Data',
          description: 'Encrypt portfolio values',
          type: 'toggle',
          path: ['Privacy & Security', 'Encrypt Sensitive Data'],
        },
        {
          label: 'Hide Balances',
          description: 'Hide portfolio values from screen',
          type: 'toggle',
          path: ['Privacy & Security', 'Hide Balances'],
        },
        {
          label: 'API Key Protection',
          description: 'Mask API keys in settings',
          type: 'toggle',
          path: ['Privacy & Security', 'API Key Protection'],
        },
        {
          label: 'Session Timeout',
          description: 'Auto-logout after inactivity',
          type: 'select',
          options: ['15 minutes', '30 minutes', '1 hour', 'Never'],
          path: ['Privacy & Security', 'Session Timeout'],
        },
      ],
    },
    {
      title: 'Advanced',
      icon: Sliders,
      settings: [
        {
          label: 'Developer Mode',
          description: 'Access advanced debugging tools',
          type: 'toggle',
          path: ['Advanced', 'Developer Mode'],
        },
        {
          label: 'Beta Features',
          description: 'Test new features before release',
          type: 'toggle',
          path: ['Advanced', 'Beta Features'],
        },
        {
          label: 'Performance Mode',
          description: 'Optimize for slower connections',
          type: 'toggle',
          path: ['Advanced', 'Performance Mode'],
        },
      ],
    },
  ], [settingsState])

  function getValue(path) {
    const [section, key] = path
    return settingsState?.[section]?.[key]
  }

  function updateValue(path, value) {
    const [section, key] = path
    setSettingsState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  function renderControl(setting) {
    const value = getValue(setting.path)
    if (setting.type === 'toggle') {
      return (
        <button
          onClick={() => updateValue(setting.path, !value)}
          className={`relative w-11 h-6 rounded-full transition ml-4 ${
            value ? 'bg-accent-600' : 'bg-obsidian-700'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
              value ? 'translate-x-5' : ''
            }`}
          />
        </button>
      )
    }
    if (setting.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => updateValue(setting.path, e.target.value)}
          className="ml-4 px-3 py-1 rounded-lg bg-obsidian-800 border border-obsidian-700 text-sm hover:border-obsidian-600 transition"
        >
          {setting.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }
    if (setting.type === 'slider') {
      return (
        <div className="ml-4 flex items-center gap-3">
          <input
            type="range"
            min={setting.min}
            max={setting.max}
            value={value}
            onChange={(e) => updateValue(setting.path, Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm font-semibold w-8 text-right">{value}%</span>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="muted text-sm mt-1">Customize your dashboard experience</p>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIdx) => {
        const Icon = section.icon
        return (
          <motion.div key={sectionIdx} variants={itemVariants} className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-5 w-5 text-accent-400" />
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting, settingIdx) => (
                <div
                  key={settingIdx}
                  className="flex items-center justify-between py-3 border-b border-obsidian-800/50 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{setting.label}</div>
                    <div className="text-xs muted mt-0.5">{setting.description}</div>
                  </div>

                  {renderControl(setting)}
                </div>
              ))}
            </div>
          </motion.div>
        )
      })}

      {/* Account & Danger Zone */}
      <motion.div variants={itemVariants} className="card p-5">
        <h2 className="text-lg font-semibold mb-4">Account & Data</h2>
        <div className="space-y-3">
          <button className="w-full p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left text-sm font-medium">
            Export Portfolio Data
          </button>
          <button className="w-full p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left text-sm font-medium">
            Clear Cache & Cookies
          </button>
          <button className="w-full p-3 rounded-lg bg-danger-600/20 hover:bg-danger-600/30 border border-danger-600/30 transition text-left text-sm font-medium text-danger-500">
            Reset All Settings to Default
          </button>
          <button className="w-full p-3 rounded-lg bg-danger-600/20 hover:bg-danger-600/30 border border-danger-600/30 transition text-left text-sm font-medium text-danger-500">
            Delete Account & Data
          </button>
        </div>
      </motion.div>

      {/* Help & Support */}
      <motion.div variants={itemVariants} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-accent-400" />
          <h2 className="text-lg font-semibold">Help & Support</h2>
        </div>
        <div className="grid gap-3">
          <button className="p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left">
            <div className="text-sm font-semibold">Documentation</div>
            <div className="text-xs muted mt-1">Learn how to use CryptoTrack</div>
          </button>
          <button className="p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left">
            <div className="text-sm font-semibold">API Reference</div>
            <div className="text-xs muted mt-1">For developers and integrations</div>
          </button>
          <button className="p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left">
            <div className="text-sm font-semibold">Report a Bug</div>
            <div className="text-xs muted mt-1">Help us improve the platform</div>
          </button>
          <button className="p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left">
            <div className="text-sm font-semibold">Contact Support</div>
            <div className="text-xs muted mt-1">Get help from our team</div>
          </button>
        </div>
      </motion.div>

      {/* Version Info */}
      <motion.div variants={itemVariants} className="card p-4 text-center">
        <div className="text-sm muted">
          CryptoTrack v1.0.0 • Last updated December 17, 2025
        </div>
        <div className="text-xs muted mt-2">
          © 2025 CryptoTrack. All rights reserved.
        </div>
      </motion.div>
    </motion.div>
  )
}
