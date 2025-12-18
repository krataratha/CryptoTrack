import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { resetPassword } from '../services/authDebug';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetPassword2, setResetPassword2] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(username.trim(), password.trim());
    } catch (err) {
      setError('Invalid username or password');
      console.log('Login failed. Debug info:');
      const users = JSON.parse(localStorage.getItem('ct_users_v1') || '{}');
      console.log('Registered users:', Object.keys(users));
      if (users[username.toLowerCase()]) {
        console.log('User exists but password may be incorrect');
      } else {
        console.log('User does not exist');
      }
    }
  }

  function handlePasswordReset(e) {
    e.preventDefault();
    if (!username.trim() || !resetPassword2.trim()) {
      setResetMessage('Please enter username and new password');
      return;
    }
    
    const result = resetPassword(username.trim().toLowerCase(), resetPassword2.trim());
    if (result.success) {
      setResetMessage('✅ Password reset successful! Try logging in with your new password.');
      setShowReset(false);
      setResetPassword2('');
      setPassword(resetPassword2);
    } else {
      setResetMessage('❌ ' + (result.error || 'Reset failed'));
    }
  }

  return (
    <div className="card p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {!showReset ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm"
            />
            {error && <div className="text-danger-500 text-sm">{error}</div>}
            <button type="submit" className="w-full rounded-lg px-3 py-2 bg-accent-600/20 border border-accent-600/30 text-accent-300 text-sm hover:bg-accent-600/30">Login</button>
          </form>
          <button
            onClick={() => setShowReset(true)}
            className="w-full mt-2 text-xs text-accent-400 hover:text-accent-300 underline"
          >
            Forgot password?
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handlePasswordReset} className="space-y-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={resetPassword2}
              onChange={(e) => setResetPassword2(e.target.value)}
              placeholder="New password"
              className="w-full rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm"
            />
            {resetMessage && <div className={`text-sm ${resetMessage.includes('✅') ? 'text-success-400' : 'text-danger-500'}`}>{resetMessage}</div>}
            <button type="submit" className="w-full rounded-lg px-3 py-2 bg-accent-600/20 border border-accent-600/30 text-accent-300 text-sm hover:bg-accent-600/30">Reset Password</button>
            <button
              type="button"
              onClick={() => {
                setShowReset(false);
                setResetMessage('');
                setResetPassword2('');
              }}
              className="w-full text-xs text-neutral-400 hover:text-neutral-300"
            >
              Back to login
            </button>
          </form>
        </>
      )}
    </div>
  );
}
