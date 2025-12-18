import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currency';
import { addUserTransaction } from '../services/transactions';
import { simulatePayment } from '../services/payment';
import { getCoinBalance, validateSellOrder } from '../services/portfolio';

export default function BuySellPanel({ coin }) {
  const { user } = useAuth();
  const { currency, convert } = useCurrency();
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe_test');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const priceUSD = coin?.price || 0;
  const displayPrice = formatCurrency(convert(priceUSD, currency), currency);
  
  // Calculate available balance for sell orders
  const availableBalance = useMemo(() => {
    if (!user || side !== 'sell') return 0;
    return getCoinBalance(user.username, coin.symbol);
  }, [user, side, coin.symbol]);

  async function submitOrder(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    if (!user) {
      setError('Please login or signup to place orders.');
      return;
    }
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      setError('Enter a valid quantity');
      return;
    }

    // Validate sell orders
    if (side === 'sell') {
      const validation = validateSellOrder(user.username, coin.symbol, qty);
      if (!validation.canSell) {
        setError(
          `Insufficient balance. You have ${validation.available} ${coin.symbol.toUpperCase()}, ` +
          `but trying to sell ${qty}. Short by ${validation.deficit.toFixed(4)}.`
        );
        return;
      }
    }

    let execPriceUSD = priceUSD;
    if (orderType === 'limit') {
      const lp = parseFloat(limitPrice);
      if (!lp || lp <= 0) {
        setError('Enter a valid limit price');
        return;
      }
      execPriceUSD = lp;
    }

    const totalUSD = execPriceUSD * qty;
    try {
      const pay = await simulatePayment({ amount: totalUSD, currency: 'USD', method: paymentMethod });
      const tx = addUserTransaction(user.username, {
        type: side,
        symbol: coin.symbol,
        name: coin.name,
        quantity: qty,
        execPriceUSD,
        totalUSD,
        currencyUsed: currency,
        totalInCurrency: convert(totalUSD, currency),
        payment: pay,
        orderType,
      });
      setStatus(`Transaction ${tx.id} succeeded via ${pay.provider}.`);
      setQuantity('');
      setLimitPrice('');
    } catch (err) {
      setError('Transaction failed. Please try again.');
    }
  }

  return (
    <div className="mt-6 card p-4">
      <div className="text-sm font-semibold mb-3">Trade {coin?.name} ({coin?.symbol?.toUpperCase()})</div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs muted">Current Price: {displayPrice}</div>
        {side === 'sell' && (
          <div className={`text-xs font-semibold ${availableBalance > 0 ? 'text-success-400' : 'text-danger-500'}`}>
            Available: {availableBalance.toFixed(4)} {coin?.symbol?.toUpperCase()}
          </div>
        )}
      </div>
      <form onSubmit={submitOrder} className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs muted">Side</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} className="rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-2 py-2 text-sm">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs muted">
            Quantity
            {side === 'sell' && availableBalance > 0 && (
              <button
                type="button"
                onClick={() => setQuantity(availableBalance.toString())}
                className="ml-2 text-accent-400 hover:text-accent-300 text-xs"
              >
                (Max: {availableBalance.toFixed(4)})
              </button>
            )}
          </label>
          <input 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            type="number" 
            min="0" 
            step="any" 
            placeholder="0.00" 
            max={side === 'sell' ? availableBalance : undefined}
            className="rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs muted">Order Type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-2 py-2 text-sm">
            <option value="market">Market</option>
            <option value="limit">Limit</option>
          </select>
        </div>
        {orderType === 'limit' && (
          <div className="space-y-2">
            <label className="text-xs muted">Limit Price (USD)</label>
            <input value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} type="number" min="0" step="any" placeholder="0.00" className="rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-3 py-2 text-sm" />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs muted">Payment (dev only)</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="rounded-lg bg-obsidian-800/60 border border-obsidian-700 px-2 py-2 text-sm">
            <option value="stripe_test">Stripe Test</option>
            <option value="paypal_sandbox">PayPal Sandbox</option>
            <option value="razorpay_test">Razorpay Test</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button type="submit" className="rounded-lg px-3 py-2 bg-accent-600/20 border border-accent-600/30 text-accent-300 text-sm">Submit</button>
          {status && <span className="text-xs text-success-400">{status}</span>}
          {error && <span className="text-xs text-danger-500">{error}</span>}
        </div>
      </form>
      <div className="mt-2 text-[11px] muted">Development-only payments simulated; no real funds are transferred.</div>
    </div>
  );
}
