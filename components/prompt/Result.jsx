'use client';

import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react'; // Ensure you have lucide-react installed
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Internal SmartRenderer (or import it if you kept it separate)
function SmartRenderer({ content }) {
  if (!content) return null;
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
          h1: ({...props}) => <h1 className="text-accent-1 text-xl font-bold mb-2" {...props} />,
          h2: ({...props}) => <h2 className="text-accent-1 text-lg font-bold mt-4 mb-2" {...props} />,
          h3: ({...props}) => <h3 className="text-white text-md font-semibold mt-3 mb-1" {...props} />,
          strong: ({...props}) => <strong className="text-white font-bold" {...props} />,
          ul: ({...props}) => <ul className="list-disc pl-4 space-y-1 text-gray-300" {...props} />,
          li: ({...props}) => <li className="pl-1" {...props} />,
          p: ({...props}) => <p className="text-gray-300 leading-relaxed mb-3" {...props} />,
          code: ({inline, ...props}) => 
            inline 
              ? <code className="bg-white/10 rounded px-1 py-0.5 text-accent-2 font-mono text-sm" {...props} />
              : <pre className="bg-black/30 p-4 rounded-xl border border-white/10 overflow-x-auto mb-4"><code className="text-sm text-gray-200 font-mono" {...props} /></pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function Result({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-dark-100 border border-glass-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <h3 className="text-accent-1 font-bold uppercase tracking-wider text-sm">
          ✨ Optimized Result
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar bg-dark-200/50">
        <SmartRenderer content={result.optimized.split("\n").slice(1, -1).filter(line => !line.startsWith("[")).join("\n")} />
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 bg-dark-300 border-t border-white/5 flex gap-4 text-xs text-gray-500 font-mono">
        <span>Tokens: {result.tokensUsed || 0}</span>
        <span>Cost: ${result.costUsd || '0.00'}</span>
      </div>
    </motion.div>
  );
}