import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

export default function PortfolioHealthModal({ isOpen, onClose, healthData }) {
  if (!healthData) return null

  const { grade, score, suggestions, metrics } = healthData

  // Grade styling
  const gradeColor =
    grade === 'A'
      ? 'text-success-400 border-success-600/30 bg-success-600/15'
      : grade === 'B'
        ? 'text-success-400 border-success-600/30 bg-success-600/10'
        : grade === 'C'
          ? 'text-warning-400 border-warning-600/30 bg-warning-600/15'
          : grade === 'D'
            ? 'text-warning-500 border-warning-600/30 bg-warning-600/10'
            : 'text-danger-400 border-danger-600/30 bg-danger-600/15'

  const gradeLabel =
    grade === 'A'
      ? 'Excellent'
      : grade === 'B'
        ? 'Good'
        : grade === 'C'
          ? 'Fair'
          : grade === 'D'
            ? 'Poor'
            : 'Critical'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl rounded-2xl border border-obsidian-800 bg-obsidian-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Header */}
              <div className="relative border-b border-obsidian-800 bg-linear-to-r from-accent-600/10 to-success-600/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-accent-600/20 border border-accent-600/30">
                      <Activity className="size-5 text-accent-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-100">Portfolio Health Report</h2>
                      <p className="text-xs text-neutral-400">Comprehensive analysis of your holdings</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid size-8 place-items-center rounded-lg hover:bg-obsidian-800/70 transition"
                  >
                    <X className="size-5 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Grade Section */}
                <div className="flex items-center gap-4">
                  <div className={`flex size-24 shrink-0 items-center justify-center rounded-2xl border-2 ${gradeColor}`}>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{grade}</div>
                      <div className="text-[10px] uppercase tracking-wider mt-0.5">{gradeLabel}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-300 mb-2">Overall Health Score</div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-obsidian-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${
                          score >= 80
                            ? 'bg-success-600'
                            : score >= 60
                              ? 'bg-warning-600'
                              : 'bg-danger-600'
                        }`}
                      />
                    </div>
                    <div className="mt-1.5 text-xs text-neutral-400">
                      Score: <span className="font-semibold text-neutral-200">{score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Assets</div>
                    <div className="mt-1 text-lg font-semibold text-neutral-100">{metrics.numAssets}</div>
                  </div>
                  <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Avg Volatility</div>
                    <div className="mt-1 text-lg font-semibold text-neutral-100">
                      {metrics.avgVolatility?.toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Total Value</div>
                    <div className="mt-1 text-lg font-semibold text-neutral-100">
                      ${(metrics.totalValue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-200">
                    <TrendingUp className="size-4 text-accent-400" />
                    Doctor's Recommendations
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-obsidian-800 bg-obsidian-900/30 p-3"
                      >
                        <div className="mt-0.5">
                          {score >= 80 ? (
                            <CheckCircle className="size-4 text-success-400" />
                          ) : (
                            <AlertTriangle className="size-4 text-warning-500" />
                          )}
                        </div>
                        <div className="flex-1 text-sm text-neutral-300 leading-relaxed">{suggestion}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Breakdown */}
                {metrics.categoryPercentages && Object.keys(metrics.categoryPercentages).length > 0 && (
                  <div>
                    <div className="mb-3 text-sm font-medium text-neutral-200">Asset Allocation</div>
                    <div className="space-y-2">
                      {Object.entries(metrics.categoryPercentages).map(([category, percentage]) => (
                        <div key={category} className="flex items-center gap-3">
                          <div className="w-24 text-xs capitalize text-neutral-400">{category}</div>
                          <div className="flex-1 h-2 overflow-hidden rounded-full bg-obsidian-800">
                            <div
                              className={`h-full ${
                                category === 'memecoin'
                                  ? 'bg-danger-600'
                                  : category === 'stablecoin'
                                    ? 'bg-neutral-600'
                                    : 'bg-accent-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-12 text-right text-xs font-medium text-neutral-300">
                            {percentage.toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-obsidian-800 bg-obsidian-900/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-400">
                    Analysis generated based on current market data
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-accent-500 hover:bg-accent-600 px-4 py-2 text-sm font-medium text-obsidian-950 transition"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
