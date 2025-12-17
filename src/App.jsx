import './App.css'
import CryptoDashboard from './components/CryptoDashboard'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CryptoDashboard />
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
