import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Bell, Lock, Zap, Sliders, HelpCircle, Download, Trash2, Mail, MessageSquare, Bug } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'

const SUPPORT_EMAIL = 'kratarathtatran@icloud.com'
const SUPPORT_PHONE = '+1 (555) 123-4567'
const SUPPORT_HOURS = 'Mon-Fri, 9AM-6PM EST'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings()
  const { user, logout } = useAuth()
  const [notification, setNotification] = useState('')

  function showNotification(message) {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  function handleExportData() {
    try {
      const data = {
        settings,
        userData: user,
        exportDate: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cryptotrack-data-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showNotification('✅ Data exported successfully!')
    } catch (err) {
      showNotification('❌ Failed to export data')
    }
  }

  function handleClearCache() {
    if (confirm('Clear cache and cookies? This will refresh the page.')) {
      // Clear all localStorage except user auth
      const authData = localStorage.getItem('ct_session_v1')
      const usersData = localStorage.getItem('ct_users_v1')
      localStorage.clear()
      if (authData) localStorage.setItem('ct_session_v1', authData)
      if (usersData) localStorage.setItem('ct_users_v1', usersData)
      showNotification('✅ Cache cleared!')
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  function handleResetSettings() {
    if (confirm('Reset all settings to default values?')) {
      resetSettings()
      showNotification('✅ Settings reset to default!')
    }
  }

  function handleDeleteAccount() {
    if (!user) {
      showNotification('❌ No user logged in')
      return
    }
    const confirmation = prompt(`Type "${user.username}" to confirm account deletion:`)
    if (confirmation === user.username) {
      // Delete user data
      const users = JSON.parse(localStorage.getItem('ct_users_v1') || '{}')
      delete users[user.username]
      localStorage.setItem('ct_users_v1', JSON.stringify(users))
      // Delete transactions
      localStorage.removeItem(`ct_tx_v1:${user.username}`)
      logout()
      showNotification('✅ Account deleted')
      setTimeout(() => window.location.reload(), 1500)
    } else if (confirmation !== null) {
      showNotification('❌ Username did not match')
    }
  }

  function handleContactSupport() {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=CryptoTrack Support Request&body=Hello Support Team,%0A%0AI need help with:%0A%0A(Please describe your issue)%0A%0AUser: ${user?.username || 'Not logged in'}%0ADate: ${new Date().toISOString()}`
    showNotification('📧 Opening email client...')
  }

  function handleReportBug() {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=CryptoTrack Bug Report&body=Bug Description:%0A%0A(Please describe the bug)%0A%0ASteps to Reproduce:%0A1.%0A2.%0A3.%0A%0AExpected Behavior:%0A(What should happen)%0A%0AActual Behavior:%0A(What actually happens)%0A%0AUser: ${user?.username || 'Not logged in'}%0ADate: ${new Date().toISOString()}`
    showNotification('📧 Opening email client...')
  }

  function copySupportEmail() {
    navigator.clipboard.writeText(SUPPORT_EMAIL)
    showNotification('✅ Email address copied to clipboard!')
  }

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
  ], [])

  function getValue(path) {
    const [section, key] = path
    return settings?.[section]?.[key]
  }

  function updateValue(path, value) {
    const [section, key] = path
    updateSetting(section, key, value)
    showNotification('✅ Setting updated!')
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
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-obsidian-900 border border-accent-600/30 shadow-lg text-sm"
        >
          {notification}
        </motion.div>
      )}

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
          <button 
            onClick={handleExportData}
            className="w-full p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Portfolio Data
          </button>
          <button 
            onClick={handleClearCache}
            className="w-full p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left text-sm font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache & Cookies
          </button>
          <button 
            onClick={handleResetSettings}
            className="w-full p-3 rounded-lg bg-danger-600/20 hover:bg-danger-600/30 border border-danger-600/30 transition text-left text-sm font-medium text-danger-500 flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            Reset All Settings to Default
          </button>
          {user && (
            <button 
              onClick={handleDeleteAccount}
              className="w-full p-3 rounded-lg bg-danger-600/20 hover:bg-danger-600/30 border border-danger-600/30 transition text-left text-sm font-medium text-danger-500 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account & Data
            </button>
          )}
        </div>
      </motion.div>

      {/* Help & Support */}
      <motion.div variants={itemVariants} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-accent-400" />
          <h2 className="text-lg font-semibold">Help & Support</h2>
        </div>
        
        {/* Support Contact Info */}
        <div className="mb-6 p-4 rounded-lg bg-obsidian-800/30 border border-accent-600/20">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Email Support</div>
                <div className="text-xs text-neutral-400 mt-1">{SUPPORT_EMAIL}</div>
                <button
                  onClick={copySupportEmail}
                  className="text-xs text-accent-400 hover:text-accent-300 mt-1 underline"
                >
                  Copy email
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-success-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Support Hours</div>
                <div className="text-xs text-neutral-400 mt-1">{SUPPORT_HOURS}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="grid gap-3">
          <button 
            onClick={handleContactSupport}
            className="p-4 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-400" />
              <div>
                <div className="text-sm font-semibold">Contact Support</div>
                <div className="text-xs muted mt-0.5">Email our support team for assistance</div>
              </div>
            </div>
          </button>
          <button 
            onClick={handleReportBug}
            className="p-4 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left"
          >
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-danger-500" />
              <div>
                <div className="text-sm font-semibold">Report a Bug</div>
                <div className="text-xs muted mt-0.5">Help us improve by reporting issues</div>
              </div>
            </div>
          </button>
          <a 
            href="https://github.com/cryptotrack/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-success-400" />
              <div>
                <div className="text-sm font-semibold">Documentation</div>
                <div className="text-xs muted mt-0.5">Learn how to use CryptoTrack</div>
              </div>
            </div>
          </a>
          <a 
            href="https://github.com/cryptotrack"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition text-left"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent-500" />
              <div>
                <div className="text-sm font-semibold">GitHub Repository</div>
                <div className="text-xs muted mt-0.5">View source code and contribute</div>
              </div>
            </div>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="mt-6 pt-6 border-t border-obsidian-700">
          <div className="text-sm font-semibold mb-3">Frequently Asked Questions</div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-obsidian-800/20">
              <div className="font-medium text-accent-300">How do I reset my password?</div>
              <div className="text-neutral-400 mt-1">Go to the Login page and click "Forgot password?" to reset your password.</div>
            </div>
            <div className="p-2 rounded bg-obsidian-800/20">
              <div className="font-medium text-accent-300">Is my data secure?</div>
              <div className="text-neutral-400 mt-1">Your data is stored locally in your browser. We use bcrypt hashing for password security.</div>
            </div>
            <div className="p-2 rounded bg-obsidian-800/20">
              <div className="font-medium text-accent-300">Can I export my portfolio?</div>
              <div className="text-neutral-400 mt-1">Yes! Use the "Export Portfolio Data" button in the Account & Data section above.</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Version Info */}
      <motion.div variants={itemVariants} className="card p-4 text-center">
        <div className="text-sm muted">
          CryptoTrack v1.0.0 • Last updated December 18, 2025
        </div>
        <div className="text-xs muted mt-2">
          © 2025 CryptoTrack. All rights reserved.
        </div>
        <div className="text-xs text-accent-400 mt-3">
          Support: {SUPPORT_EMAIL}
        </div>
      </motion.div>
    </motion.div>
  )
}
