import './App.css'
import CryptoDashboard from './components/CryptoDashboard'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CurrencyProvider>
          <CryptoDashboard />
        </CurrencyProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
