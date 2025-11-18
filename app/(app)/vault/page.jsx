'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProject } from '@/components/providers/ProjectProvider'; // Hook
import VaultCard from '@/components/vault/VaultCard';
import { fadeUp, staggerContainer, staggerItem } from '@/components/motion/variants';

export default function VaultPage() {
  // Use Global Context
  const { projects, activeProject, switchProject, isLoading: projectsLoading } = useProject();

  const [prompts, setPrompts] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  // Fetch Prompts when Active Project changes
  useEffect(() => {
    if (activeProject) {
      fetchPrompts(activeProject._id);
    }
  }, [activeProject]);

  async function fetchPrompts(projectId) {
    setPromptsLoading(true);
    try {
      const res = await fetch(`/api/vault?projectId=${projectId}`);
      const data = await res.json();
      if (Array.isArray(data)) setPrompts(data);
    } catch (err) {
      console.error('Failed to load prompts', err);
    } finally {
      setPromptsLoading(false);
    }
  }

  // Filter Logic
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.snippet?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProfession = selectedProfession === 'all' || prompt.profession === selectedProfession;

    return matchesSearch && matchesProfession;
  });

  if (projectsLoading) return <div className="pt-32 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-8"
        >
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Prompt Vault
            </h1>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Viewing collection:</span>
              
              {/* Global Project Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                  className="flex items-center gap-2 text-accent-1 hover:text-accent-2 font-medium transition-colors"
                >
                  {activeProject?.name || 'Select Project'}
                  <span className="text-xs">▼</span>
                </button>

                <AnimatePresence>
                  {isProjectMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-dark-100 border border-glass-border rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                        {projects.map(p => (
                          <button
                            key={p._id}
                            onClick={() => {
                              switchProject(p._id);
                              setIsProjectMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeProject?._id === p._id 
                                ? 'bg-accent-1/20 text-accent-1' 
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{filteredPrompts.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Saved Prompts</div>
          </div>
        </motion.div>

        {/* Filters & Grid (Simplified for brevity, keeping core logic) */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
           <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-100 border border-glass-border rounded-xl py-3 px-4 text-white mb-4"
            />
        </motion.div>

        {/* Grid */}
        {filteredPrompts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPrompts.map((prompt) => (
              <motion.div key={prompt._id} variants={staggerItem}>
                <VaultCard
                  id={prompt._id}
                  title={prompt.title}
                  snippet={prompt.snippet}
                  profession={prompt.profession}
                  style={prompt.style}
                  tags={prompt.tags}
                  version={prompt.version}
                  createdAt={prompt.createdAt}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
           <div className="text-center py-20 text-gray-500">No prompts found in this project.</div>
        )}
      </div>
    </div>
  );
}