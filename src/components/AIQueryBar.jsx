import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { getAIResponse } from '../services/aiEngine';

export default function AIQueryBar({ allCryptoData }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  async function handleAsk(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await getAIResponse(query, { allCryptoData });
      setResponse(res);
    } catch (err) {
      setResponse('Sorry, the AI engine had trouble answering. Try rephrasing your question.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleAsk} className="card p-4 flex items-center gap-3">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI about markets, coins, risk, trends..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:muted"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg px-3 py-2 text-sm bg-accent-600/20 border border-accent-600/30 text-accent-300 hover:bg-accent-600/30 disabled:opacity-60"
        >
          {loading ? 'Thinking…' : 'Ask AI'}
        </button>
      </form>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-obsidian-900/70 border border-obsidian-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span className="text-sm font-semibold">AI Response</span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{response}</p>
        </motion.div>
      )}
    </div>
  );
}
