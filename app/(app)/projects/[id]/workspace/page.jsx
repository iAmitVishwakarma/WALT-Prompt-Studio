'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Composer from '@/components/prompt/Composer';
import VaultCard from '@/components/vault/VaultCard';
import { fadeUp, staggerContainer, staggerItem } from '@/components/motion/variants';
import { ArrowLeft, Layout, History } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectWorkspacePage({ params }) {
  const { id } = use(params); // Project ID
  const [project, setProject] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Project Context & History
  async function refreshWorkspace() {
    try {
      // Fetch Project Details
      const projRes = await fetch(`/api/projects/${id}`);
      if (!projRes.ok) throw new Error("Project not found");
      const projData = await projRes.json();
      setProject(projData);

      // Fetch History (Prompts for this project)
      const vaultRes = await fetch(`/api/vault?projectId=${id}`);
      const vaultData = await vaultRes.json();
      if (Array.isArray(vaultData)) setHistory(vaultData);

    } catch (error) {
      toast.error("Failed to load workspace");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshWorkspace();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-500">Loading Workspace...</div>;
  if (!project) return <div className="min-h-screen pt-32 text-center">Project not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
           <Link href="/projects" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider flex items-center mb-2 transition-colors">
             <ArrowLeft className="w-3 h-3 mr-1" /> Projects
           </Link>
           <div className="flex items-center gap-3">
             <div className="p-2 bg-accent-1/10 rounded-lg text-accent-1">
               <Layout className="w-6 h-6" />
             </div>
             <div>
               <h1 className="font-display text-3xl font-bold text-white">{project.name}</h1>
               <p className="text-gray-400 text-sm">Workspace & Context History</p>
             </div>
           </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Editor (Context Aware) */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <div className="glass rounded-glass p-1 border-t border-white/10 shadow-xl">
                <div className="bg-dark-200/50 rounded-[14px] p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-white mb-1">Contextual Improviser</h2>
                    <p className="text-xs text-gray-500">Prompts optimized here are saved to this project's history.</p>
                  </div>
                  {/* Pass Project ID to Composer so it saves automatically or maintains context */}
                  <Composer projectId={id} onSave={refreshWorkspace} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-white flex items-center">
                  <History className="w-4 h-4 mr-2 text-gray-400" />
                  Project History
                </h3>
                <span className="text-xs text-gray-500">{history.length} prompts</span>
              </div>

              <div className="space-y-3 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
                {history.length === 0 ? (
                  <div className="text-center py-10 px-6 rounded-xl border border-dashed border-white/10 text-gray-500 text-sm">
                    No history yet. Start composing!
                  </div>
                ) : (
                  history.map((prompt) => (
                    <VaultCard
                      key={prompt._id}
                      id={prompt._id}
                      title={prompt.title}
                      snippet={prompt.snippet}
                      profession={prompt.profession}
                      style={prompt.style}
                      tags={prompt.tags}
                      version={prompt.version}
                      createdAt={prompt.createdAt}
                    />
                  ))
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}