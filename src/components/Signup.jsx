import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { suggestUsernames } from '../services/auth';

export default function Signup() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuggestions([]);
    try {
      await signup(username, password);
    } catch (err) {
      if (err.message === 'USERNAME_TAKEN') {
        setError('Username already taken');
        setSuggestions(err.suggestions || suggestUsernames(username));
      } else {
        setError('Signup failed');
      }
    }
  }

  return (
    <div className="card p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          className="w-full rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm"
        />
        {error && <div className="text-warning-500 text-sm">{error}</div>}
        {!!suggestions.length && (
          <div className="text-xs muted">
            Try: {suggestions.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setUsername(s)}
                className="inline-flex mx-1 my-0.5 px-2 py-1 rounded bg-obsidian-800 border border-obsidian-700 hover:bg-obsidian-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <button type="submit" className="rounded-lg px-3 py-2 bg-accent-600/20 border border-accent-600/30 text-accent-300 text-sm">Sign Up</button>
      </form>
    </div>
  );
}
