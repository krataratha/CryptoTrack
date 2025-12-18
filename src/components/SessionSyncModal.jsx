import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, Check } from 'lucide-react';
import { createSessionSyncCode, validateAndUseSyncCode } from '../services/sessionSync';

export function SessionSyncModal({ isOpen, onClose, username, profilePhoto }) {
  const [syncCode, setSyncCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [syncMessage, setSyncMessage] = useState('');

  function generateCode() {
    const code = createSessionSyncCode(username, profilePhoto);
    if (code) {
      setSyncCode(code);
      setSyncMessage('');
    } else {
      setSyncMessage('❌ Failed to generate code');
    }
  }

  function copyCode() {
    if (syncCode) {
      navigator.clipboard.writeText(syncCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleSyncWithCode() {
    if (!inputCode.trim()) {
      setSyncMessage('❌ Please enter a sync code');
      return;
    }

    const result = validateAndUseSyncCode(inputCode.trim().toUpperCase());
    if (result.success) {
      setSyncMessage('✅ Sync successful! Logging you in...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setSyncMessage('❌ ' + result.error);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="card p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cross-Device Login</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-obsidian-800 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!syncCode ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-300">
                  Generate a sync code to login from another device
                </p>
                <button
                  onClick={generateCode}
                  className="w-full px-4 py-2 bg-accent-600/20 border border-accent-600/30 text-accent-300 rounded-lg hover:bg-accent-600/30 transition text-sm font-medium"
                >
                  Generate Sync Code
                </button>
                <div className="border-t border-obsidian-700 pt-4">
                  <p className="text-sm text-neutral-400 mb-3">
                    Or enter a code from another device
                  </p>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="Enter sync code"
                    maxLength="8"
                    className="w-full px-3 py-2 rounded-lg bg-obsidian-800/60 border border-obsidian-700 text-sm text-center font-mono text-accent-300"
                  />
                  <button
                    onClick={handleSyncWithCode}
                    className="w-full mt-3 px-4 py-2 bg-success-600/20 border border-success-600/30 text-success-400 rounded-lg hover:bg-success-600/30 transition text-sm font-medium"
                  >
                    Sync Login
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-neutral-300">
                  Share this code on your other device to login
                </p>
                <div className="bg-obsidian-800/60 p-4 rounded-lg border border-accent-600/30">
                  <div className="text-center font-mono text-2xl font-bold text-accent-300 tracking-widest">
                    {syncCode}
                  </div>
                  <p className="text-xs text-neutral-400 text-center mt-2">
                    Valid for 24 hours
                  </p>
                </div>
                <button
                  onClick={copyCode}
                  className="w-full px-4 py-2 bg-obsidian-800/50 border border-obsidian-700 rounded-lg hover:bg-obsidian-800 transition text-sm font-medium flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSyncCode('');
                    setInputCode('');
                  }}
                  className="w-full px-4 py-2 bg-danger-600/20 border border-danger-600/30 text-danger-400 rounded-lg hover:bg-danger-600/30 transition text-sm font-medium"
                >
                  Generate New Code
                </button>
              </div>
            )}

            {syncMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm text-center ${syncMessage.includes('✅') ? 'bg-success-600/20 text-success-400' : 'bg-danger-600/20 text-danger-400'}`}>
                {syncMessage}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SessionSyncModal;
