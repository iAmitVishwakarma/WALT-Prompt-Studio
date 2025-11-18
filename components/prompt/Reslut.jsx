import { AnimatePresence,motion } from 'framer-motion'
import { fadeUp, scaleIn, lift } from '../motion/variants';

const Result = () => {
    
  return (
   <AnimatePresence>
        {result && (
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="glass p-6 rounded-glass border border-accent-1/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-white">
                Optimized Result
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">
                  {result.tokensUsed} tokens
                </span>
                <span className="text-sm text-accent-3">
                  ${result.costUsd.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Optimized Prompt */}
            <div className="bg-dark-100/50 p-4 rounded-xl mb-4 border border-glass-border">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {result.optimized}
              </p>
            </div>

            {/* Comparison Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-1">
                  {Math.ceil((result.optimized.length / result.original.length) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-2">
                  {result.tokensUsed}
                </div>
                <div className="text-xs text-gray-400">Tokens Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-3">
                  {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : 'Just now'}
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleSaveToVault}
                className="flex-1 glass py-3 rounded-xl font-semibold text-white hover:bg-glass-hover transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                💾 Save to Vault
              </motion.button>
              <motion.button
                onClick={() => navigator.clipboard.writeText(result.optimized)}
                className="flex-1 glass py-3 rounded-xl font-semibold text-white hover:bg-glass-hover transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📋 Copy
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  )
}

export default Result