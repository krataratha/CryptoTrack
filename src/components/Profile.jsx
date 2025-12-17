import { useAuth } from '../context/AuthContext';
import { getUserTransactions } from '../services/transactions';
import { useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currency';

export default function Profile() {
  const { user, logout } = useAuth();
  const { currency, convert } = useCurrency();
  const txs = useMemo(() => (user ? getUserTransactions(user.username) : []), [user]);
  if (!user) {
    return (
      <div className="card p-6 max-w-md">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <p className="text-sm muted">You are not logged in.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="card p-6 max-w-md">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <div className="space-y-2 text-sm">
          <div><span className="muted">Username:</span> <span className="font-semibold">{user.username}</span></div>
        </div>
        <div className="mt-4">
          <button onClick={logout} className="rounded-lg px-3 py-2 bg-danger-600/20 border border-danger-600/30 text-danger-400 text-sm">Logout</button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Transactions</h3>
        {!txs.length && <div className="text-sm muted">No transactions yet.</div>}
        {!!txs.length && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian-800 text-neutral-400 text-xs">
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Symbol</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Exec Price ({currency})</th>
                  <th className="py-2 text-right">Total ({currency})</th>
                  <th className="py-2 text-left">Payment</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {txs.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="py-2 capitalize">{t.type}</td>
                    <td className="py-2 uppercase">{t.symbol}</td>
                    <td className="py-2 text-right">{t.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(convert(t.execPriceUSD || 0, currency), currency)}</td>
                    <td className="py-2 text-right">{formatCurrency(convert(t.totalUSD || 0, currency), currency)}</td>
                    <td className="py-2">{t.payment?.provider || 'DevPay'}</td>
                    <td className="py-2">{t.payment?.status || 'succeeded'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-2 text-[11px] muted">Development transactions stored locally; no real payments processed.</div>
      </div>
    </div>
  );
}
