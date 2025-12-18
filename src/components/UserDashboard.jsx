import { useAuth } from '../context/AuthContext';
import { getUserTransactions } from '../services/transactions';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currency';
import { updateUserProfile } from '../services/auth';
import { User, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

export default function UserDashboard() {
  const { user, setUser } = useAuth();
  const { currency } = useCurrency();
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  const transactions = user ? getUserTransactions(user.username) : [];
  const purchases = transactions.filter(tx => tx.type === 'buy');
  const sales = transactions.filter(tx => tx.type === 'sell');

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be less than 2MB');
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dataUrl = event.target.result;
        updateUserProfile(user.username, { profilePhoto: dataUrl });
        setUser({ ...user, profilePhoto: dataUrl });
      } catch (err) {
        setUploadError('Failed to upload photo');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    try {
      updateUserProfile(user.username, { profilePhoto: null });
      setUser({ ...user, profilePhoto: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadError('Failed to remove photo');
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-xl font-bold">User Dashboard</h2>
        {!user && <p className="text-sm muted mt-1">Login or Signup to personalize your experience.</p>}
        {user && (
          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent-600/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-obsidian-800/60 border-2 border-obsidian-700 flex items-center justify-center">
                  <User className="w-10 h-10 text-neutral-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm mb-2">Welcome back, <span className="font-semibold">{user.username}</span>!</p>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="profile-photo-upload"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="cursor-pointer inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-accent-600/20 border border-accent-600/30 text-accent-300 text-xs hover:bg-accent-600/30 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {user.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </label>
                {user.profilePhoto && (
                  <button
                    onClick={removePhoto}
                    className="rounded-lg px-3 py-1.5 bg-danger-600/20 border border-danger-600/30 text-danger-400 text-xs hover:bg-danger-600/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              {uploadError && <p className="text-xs text-danger-500 mt-1">{uploadError}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Activity Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
          {!user ? (
            <p className="text-xs muted">Login to view activity.</p>
          ) : transactions.length === 0 ? (
            <p className="text-xs muted">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="muted">Total Transactions</span>
                <span className="font-semibold">{transactions.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="muted">Purchases</span>
                <span className="font-semibold text-success-400">{purchases.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="muted">Sales</span>
                <span className="font-semibold text-warning-400">{sales.length}</span>
              </div>
            </div>
          )}
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3">Preferences</h3>
          <p className="text-xs muted">Configure currency, alerts, and privacy in Settings.</p>
        </div>
      </div>

      {/* Transaction History */}
      {user && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Purchased Coins */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
              <span>💰 Purchased Coins</span>
              {purchases.length > 0 && (
                <span className="text-xs text-success-400 font-normal">
                  {purchases.length} transaction{purchases.length !== 1 ? 's' : ''}
                </span>
              )}
            </h3>
            {purchases.length === 0 ? (
              <p className="text-xs muted">No purchases yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {purchases.slice(0, 10).map(tx => (
                  <div key={tx.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-obsidian-800/40 border border-obsidian-700/50 hover:border-obsidian-600/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{tx.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {tx.symbol.toUpperCase()}
                      </div>
                      <div className="text-xs muted mt-1">
                        Qty: {tx.quantity} • {formatCurrency(tx.execPriceUSD, 'USD')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-success-400">
                        {formatCurrency(tx.totalInCurrency, tx.currencyUsed || currency)}
                      </div>
                      <div className="text-xs muted mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sold Coins */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
              <span>📤 Sold Coins</span>
              {sales.length > 0 && (
                <span className="text-xs text-warning-400 font-normal">
                  {sales.length} transaction{sales.length !== 1 ? 's' : ''}
                </span>
              )}
            </h3>
            {sales.length === 0 ? (
              <p className="text-xs muted">No sales yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sales.slice(0, 10).map(tx => (
                  <div key={tx.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-obsidian-800/40 border border-obsidian-700/50 hover:border-obsidian-600/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{tx.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {tx.symbol.toUpperCase()}
                      </div>
                      <div className="text-xs muted mt-1">
                        Qty: {tx.quantity} • {formatCurrency(tx.execPriceUSD, 'USD')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-warning-400">
                        {formatCurrency(tx.totalInCurrency, tx.currencyUsed || currency)}
                      </div>
                      <div className="text-xs muted mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
