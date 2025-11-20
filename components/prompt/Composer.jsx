// components/Composer.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Result from './Result';

// Icons (you used lucide-react names earlier; import explicitly if you want)
import { Loader2, Wand2 } from 'lucide-react';

// --- Simple framework list used in the UI (kept small & matching your UI) ---
const FRAMEWORKS = [
  { id: 'walt', name: 'WALT' },
  { id: 'race', name: 'RACE' },
  { id: 'cce', name: 'CCE' },
  { id: 'aida', name: 'AIDA' },
  { id: 'pas', name: 'PAS' },
  { id: 'costar', name: 'CO-STAR' },
  { id: 'cot', name: 'Chain-of-Thought' },
  { id: 'tot', name: 'Tree-of-Thought' },
  { id: 'react', name: 'ReAct' },
  { id: 'deliberate', name: 'Deliberate' },
];

export default function Composer({ projectId = null, onSave = null }) {
  const [prompt, setPrompt] = useState('');
  const [profession, setProfession] = useState('general');
  const [style, setStyle] = useState(FRAMEWORKS[0].id);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // UI toggles & advanced options
  const [showFrameworkInfo, setShowFrameworkInfo] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    examples: false,
    constraints: false,
    tone: false,
    format: false,
  });

  // Abort controller ref for fetches
  const abortRef = useRef(null);

  // Simple token estimate (stub)
  const estimateTokens = (text) => {
    if (!text) return 0;
    // approx 4 characters per token heuristic
    return Math.max(1, Math.ceil(text.length / 4));
  };

  // Toggle advanced option helper
  function toggleAdvanced(key) {
    setAdvancedOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Cleanup pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  async function handleOptimize() {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    // Cancel any previous pending request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/prompt/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          profession,
          style,
          projectId,
          advancedOptions,
        }),
        signal: controller.signal,
      });

      // network failure or aborted will throw
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Optimization failed');
      }

      setResult(data);
      toast.success('Prompt optimized successfully!');

      if (onSave) {
        try {
          onSave(data);
        } catch (e) {
          // parent onSave may be optional
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request aborted — don't show an error toast
        console.log('Optimize request aborted');
      } else {
        console.error(err);
        toast.error(err?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Prompt Input */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-3">Your Raw Prompt Idea</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your raw prompt idea here... (e.g. 'Write a blog post about AI trends in 2024')"
              className="input-inset w-full min-h-[140px] resize-y text-base leading-relaxed rounded-lg p-3 bg-transparent border border-slate-700"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {prompt.length} / 5000 chars
            </div>
          </div>
        </div>

        {/* Profession Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Target Profession</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'developer', label: 'Developer', icon: '💻', desc: 'Code & Tech' },
              { id: 'marketer', label: 'Marketer', icon: '📊', desc: 'Growth & Analytics' },
              { id: 'designer', label: 'Designer', icon: '🎨', desc: 'UI/UX & Visual' },
              { id: 'writer', label: 'Writer', icon: '✍️', desc: 'Content & Copy' },
              { id: 'analyst', label: 'Analyst', icon: '📈', desc: 'Data & Insights' },
              { id: 'manager', label: 'Manager', icon: '🚀', desc: 'Product & Strategy' },
              { id: 'educator', label: 'Educator', icon: '📚', desc: 'Teaching & Training' },
              { id: 'general', label: 'General', icon: '🌐', desc: 'Multi-purpose' },
            ].map((prof) => (
              <motion.button
                key={prof.id}
                type="button"
                onClick={() => setProfession(prof.id)}
                className={`relative p-4 rounded-xl border transition-all text-left ${
                  profession === prof.id
                    ? 'bg-accent-1/10 border-accent-1 shadow-glow-indigo'
                    : 'glass border-glass-border hover:border-glass-hover'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={profession === prof.id}
              >
                <div className="text-2xl mb-2">{prof.icon}</div>
                <div className="font-semibold text-white text-sm mb-0.5">{prof.label}</div>
                <div className="text-xs text-gray-500">{prof.desc}</div>

                {profession === prof.id && (
                  <motion.div
                    layoutId={`profession-${prof.id}`} // make unique per prof to avoid collisions across components
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent-1 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    aria-hidden
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Framework / Styles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-300">Optimization Framework</label>
            <button
              type="button"
              onClick={() => setShowFrameworkInfo((s) => !s)}
              className="text-xs text-accent-1 hover:text-accent-2 transition-colors flex items-center space-x-1"
            >
              <span>Framework Guide</span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showFrameworkInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-xl p-4 mb-4 text-sm text-gray-400 leading-relaxed"
              >
                <p className="mb-2">
                  <strong className="text-white">Choose the best framework for your use case:</strong>
                </p>
                <ul className="space-y-1 text-xs">
                  <li>• <strong className="text-accent-1">WALT</strong> - Structured prompts (Who, Action, Limitation, Tone)</li>
                  <li>• <strong className="text-accent-1">RACE</strong> - Role-based clarity (Role, Action, Context, Expectation)</li>
                  <li>• <strong className="text-accent-1">AIDA</strong> - Persuasive content (Attention, Interest, Desire, Action)</li>
                  <li>• <strong className="text-accent-1">Chain-of-Thought</strong> - Step-by-step reasoning</li>
                  <li>• <strong className="text-accent-1">ReAct</strong> - Reasoning + Action for complex tasks</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {FRAMEWORKS.map((framework) => (
              <motion.button
                key={framework.id}
                type="button"
                onClick={() => setStyle(framework.id)}
                className={`relative group p-4 rounded-xl border transition-all text-left overflow-hidden ${
                  style === framework.id ? 'border-white shadow-clay bg-slate-800/30' : 'glass border-glass-border hover:border-glass-hover'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={style === framework.id}
              >
                {style === framework.id && (
                  <motion.div
                    layoutId={`framework-bg-${framework.id}`}
                    className="absolute inset-0 opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.12 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden
                  />
                )}

                <div className="relative z-10">
                  <div className="font-bold text-white text-sm mb-1">{framework.name}</div>
                  <div className="text-xs text-gray-400 leading-tight">Use {framework.name} structure</div>
                </div>

                {style === framework.id && (
                  <motion.div
                    className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    aria-hidden
                  >
                    <svg className="w-3 h-3 text-accent-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
          >
            <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">Advanced Options</span>
          </button>

          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-3">
                {[
                  { id: 'examples', label: 'Include Examples', desc: 'Add sample outputs' },
                  { id: 'constraints', label: 'Set Constraints', desc: 'Define limitations' },
                  { id: 'tone', label: 'Specify Tone', desc: 'Communication style' },
                  { id: 'format', label: 'Output Format', desc: 'Structure type' },
                ].map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => toggleAdvanced(option.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${advancedOptions[option.id] ? 'bg-accent-2/10 border-accent-2' : 'glass border-glass-border hover:border-glass-hover'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={!!advancedOptions[option.id]}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{option.label}</span>
                      <div className={`w-9 h-5 rounded-full transition-all ${advancedOptions[option.id] ? 'bg-accent-2' : 'bg-gray-600'}`}>
                        <motion.div
                          className="w-3.5 h-3.5 bg-white rounded-full"
                          animate={{ x: advancedOptions[option.id] ? 18 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Optimize Button */}
        <motion.button
          type="button"
          onClick={handleOptimize}
          disabled={!prompt.trim() || loading}
          className="btn-clay w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group rounded-lg"
          whileHover={!loading && prompt.trim() ? { scale: 1.02 } : {}}
          whileTap={!loading && prompt.trim() ? { scale: 0.98 } : {}}
          aria-disabled={!prompt.trim() || loading}
        >
          {!loading && prompt.trim() && (
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 opacity-0 group-hover:opacity-20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              aria-hidden
            />
          )}

          <span className="relative z-10 flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-white" />
                <span>Optimizing with {FRAMEWORKS.find((f) => f.id === style)?.name}...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Optimize with {FRAMEWORKS.find((f) => f.id === style)?.name}</span>
              </>
            )}
          </span>
        </motion.button>

        {/* Result */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Result result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
