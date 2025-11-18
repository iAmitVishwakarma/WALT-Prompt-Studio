'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, scaleIn, lift } from '../motion/variants';



const PROFESSIONS = [
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'marketer', label: 'Marketer', icon: '📊' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'writer', label: 'Writer', icon: '✍️' },
  { id: 'analyst', label: 'Data Analyst', icon: '📈' },
  { id: 'manager', label: 'Product Manager', icon: '🚀' },
  { id: 'other', label: 'Other', icon: '👤' },
];

const STYLE_FRAMEWORKS = [
  { 
    id: 'walt', 
    label: 'WALT', 
    description: 'Who, Action, Limitation, Tone',
    color: 'from-accent-1 to-purple-600'
  },
  { 
    id: 'race', 
    label: 'RACE', 
    description: 'Role, Action, Context, Expectation',
    color: 'from-accent-2 to-orange-500'
  },
  { 
    id: 'cce', 
    label: 'CCE', 
    description: 'Context, Constraint, Example',
    color: 'from-accent-3 to-yellow-500'
  },
  { 
    id: 'custom', 
    label: 'Custom', 
    description: 'Free-form optimization',
    color: 'from-green-500 to-teal-500'
  },
];

const CONTEXT_TOGGLES = [
  { id: 'examples', label: 'Add Examples', description: 'Include sample outputs' },
  { id: 'constraints', label: 'Include Constraints', description: 'Define limitations' },
  { id: 'tone', label: 'Specify Tone', description: 'Set communication style' },
  { id: 'format', label: 'Output Format', description: 'Define structure' },
];



export default function Composer({ compact = false, projectId, onSave }) {
  const [profession, setProfession] = useState('developer');
  const [style, setStyle] = useState('walt');
  const [prompt, setPrompt] = useState('');
  const [contextToggles, setContextToggles] = useState({
    examples: false,
    constraints: false,
    tone: false,
    format: false,
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);

  // Estimate token count (rough approximation: ~4 chars per token)
  const estimatedTokens = Math.ceil(prompt.length / 4);

  // Toggle context option
  const toggleContext = (id) => {
    setContextToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle optimization
const handleOptimize = async () => {
    if (!prompt.trim()) return;
    setIsOptimizing(true);
    try {
      const response = await fetch('/api/prompt/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          profession,
          style,
          context: contextToggles,
          projectId // Send Project ID for context memory
        }),
      });
    
}catch (error) {
      console.error('Optimization error:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Handle save to vault
const handleSaveToVault = async () => {
    if (!result) return;
    
    // Validation: Ensure a project is selected
    if (!projectId) {
      alert("Please select or create a project first!");
      return;
    }

    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${PROFESSIONS.find(p => p.id === profession)?.label} Prompt`,
          originalPrompt: result.original,
          optimizedPrompt: result.optimized,
          profession,
          style,
          tags: [profession, style],
          projectId // Attach to Project
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Saved to Vault!');
        if (onSave) onSave(); // Trigger refresh in parent
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };
  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      
      {/* ============================================
          PROFESSION PICKER
          ============================================ */}
      {!compact && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Your Profession
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROFESSIONS.map((prof) => (
              <motion.button
                key={prof.id}
                onClick={() => setProfession(prof.id)}
                className={`p-4 rounded-xl border transition-all ${
                  profession === prof.id
                    ? 'bg-accent-1/20 border-accent-1 shadow-glow-indigo'
                    : 'glass border-glass-border hover:border-glass-hover'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-2">{prof.icon}</div>
                <div className="text-sm font-medium text-white">{prof.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Compact profession picker (dropdown) */}
      {compact && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Profession
          </label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="input-inset w-full"
          >
            {PROFESSIONS.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.icon} {prof.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ============================================
          STYLE FRAMEWORK CHIPS
          ============================================ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Style Framework
        </label>
        <div className="flex flex-wrap gap-3">
          {STYLE_FRAMEWORKS.map((framework) => (
            <motion.button
              key={framework.id}
              onClick={() => setStyle(framework.id)}
              className={`group relative px-6 py-3 rounded-xl border transition-all ${
                style === framework.id
                  ? 'border-white shadow-clay'
                  : 'glass border-glass-border hover:border-glass-hover'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Gradient background on selected */}
              {style === framework.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${framework.color} opacity-20 rounded-xl`} />
              )}
              
              <div className="relative z-10">
                <div className="font-bold text-white mb-1">{framework.label}</div>
                <div className="text-xs text-gray-400">{framework.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ============================================
          CONTEXT TOGGLES
          ============================================ */}
      {!compact && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Context Options
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CONTEXT_TOGGLES.map((toggle) => (
              <motion.button
                key={toggle.id}
                onClick={() => toggleContext(toggle.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  contextToggles[toggle.id]
                    ? 'bg-accent-2/20 border-accent-2'
                    : 'glass border-glass-border hover:border-glass-hover'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-white text-sm">{toggle.label}</span>
                  <div className={`w-10 h-6 rounded-full transition-all ${
                    contextToggles[toggle.id] ? 'bg-accent-2' : 'bg-gray-600'
                  }`}>
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full mt-1"
                      animate={{ x: contextToggles[toggle.id] ? 20 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">{toggle.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ============================================
          PROMPT EDITOR
          ============================================ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-300">
            Your Prompt
          </label>
          <span className="text-xs text-gray-500">
            ~{estimatedTokens} tokens
          </span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here... e.g., 'Create a landing page for a SaaS product'"
          className="input-inset w-full min-h-[150px] resize-y"
          rows={compact ? 4 : 6}
        />
      </motion.div>

      {/* ============================================
          RUN BUTTON
          ============================================ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleOptimize}
          disabled={!prompt.trim() || isOptimizing}
          className="btn-clay w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={prompt.trim() && !isOptimizing ? { scale: 1.02 } : {}}
          whileTap={prompt.trim() && !isOptimizing ? { scale: 0.98 } : {}}
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Optimizing...
            </span>
          ) : (
            <>
              ✨ Optimize with {STYLE_FRAMEWORKS.find(s => s.id === style)?.label}
            </>
          )}
        </motion.button>
      </motion.div>

      {/* ============================================
          RESULTS PANEL
          ============================================ */}
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
    </div>
  );
}