'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Trash2, 
  Calendar, 
  Tag, 
  Briefcase,
  Sparkles 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Ensure this is installed

// --- Reusing SmartRenderer Logic Inline for Consistency ---
function SmartRenderer({ content }) {
  if (!content) return null;
  return (
    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
      <ReactMarkdown
        components={{
          h1: ({...props}) => <h1 className="text-accent-1 text-2xl font-bold mb-4" {...props} />,
          h2: ({...props}) => <h2 className="text-accent-1 text-xl font-bold mt-6 mb-3" {...props} />,
          strong: ({...props}) => <strong className="text-white font-bold" {...props} />,
          ul: ({...props}) => <ul className="list-disc pl-5 space-y-2 text-gray-300" {...props} />,
          li: ({...props}) => <li className="pl-1" {...props} />,
          p: ({...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
          code: ({inline, ...props}) => 
            inline 
              ? <code className="bg-white/10 rounded px-1.5 py-0.5 text-accent-2 font-mono text-sm" {...props} />
              : <pre className="bg-black/30 p-5 rounded-xl border border-white/10 overflow-x-auto mb-6 mt-2"><code className="text-sm text-gray-200 font-mono" {...props} /></pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// --- Main Page Component ---
export default function PromptDetailPage({ params }) {
  // Unwrap params for Next.js 16 / React 19
  const { id } = use(params);
  const router = useRouter();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const res = await fetch(`/api/vault/${id}`);
        if (!res.ok) throw new Error('Prompt not found');
        const data = await res.json();
        setPrompt(data);
      } catch (err) {
        toast.error("Could not load prompt");
        router.push('/vault');
      } finally {
        setLoading(false);
      }
    }
    fetchPrompt();
  }, [id, router]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this prompt? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/vault/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Prompt deleted");
        router.push('/vault');
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Could not delete prompt");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-1"></div>
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/vault" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vault
          </Link>
        </div>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent-1/10 text-accent-1 text-xs font-bold uppercase tracking-wider border border-accent-1/20">
                v{prompt.version}
              </span>
              <span className="px-3 py-1 rounded-full bg-dark-100 text-gray-400 text-xs font-medium border border-white/5 capitalize flex items-center">
                 <Briefcase className="w-3 h-3 mr-1.5" /> {prompt.profession}
              </span>
              <span className="px-3 py-1 rounded-full bg-dark-100 text-gray-400 text-xs font-medium border border-white/5 capitalize flex items-center">
                 <Sparkles className="w-3 h-3 mr-1.5" /> {prompt.style}
              </span>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {prompt.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {prompt.tags?.map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-dark-100 px-2 py-1 rounded border border-white/5">
                  #{tag}
                </span>
              ))}
              <span className="text-xs text-gray-600 flex items-center px-2 py-1">
                <Calendar className="w-3 h-3 mr-1.5" />
                {new Date(prompt.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(prompt.optimizedPrompt)}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-1 text-white rounded-xl hover:bg-accent-1/90 transition-colors shadow-glow-indigo font-medium"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-100 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content: Optimized Prompt */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl border border-accent-1/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-accent-2" />
                  Optimized Prompt
                </h3>
              </div>
              <div className="p-6 md:p-8 bg-dark-100/50 min-h-[300px]">
                <SmartRenderer content={prompt.optimizedPrompt} />
              </div>
            </div>
          </motion.div>

          {/* Sidebar: Original Context */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Original Input */}
            <div className="bg-dark-100 rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Original Request
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {prompt.originalPrompt}
              </p>
            </div>

            {/* Quick Info */}
            <div className="bg-dark-100 rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300 border-b border-white/5 pb-2">
                  <span>Framework</span>
                  <span className="font-mono text-accent-3">{prompt.style.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-gray-300 border-b border-white/5 pb-2">
                  <span>Profession</span>
                  <span className="capitalize">{prompt.profession}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Project</span>
                  <span>Active Project</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}