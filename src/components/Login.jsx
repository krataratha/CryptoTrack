import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid username or password');
    }
  }

  return (
    <div className="card p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
        <button type="submit" className="rounded-lg px-3 py-2 bg-accent-600/20 border border-accent-600/30 text-accent-300 text-sm">Login</button>
      </form>
    </div>
  );
}
