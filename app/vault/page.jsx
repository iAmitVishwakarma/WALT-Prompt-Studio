'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VaultCard from '@/components/VaultCard';
import { fadeUp, staggerContainer, staggerItem } from '@/components/motion/variants';

export default function VaultPage() {
  // Data State
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  // 1. Fetch Projects on Load
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
        // Default to first project if exists
        if (data.length > 0) {
          setSelectedProjectId(data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // 2. Fetch Prompts when Project Changes
  useEffect(() => {
    if (!selectedProjectId) return;

    async function fetchPrompts() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/vault?projectId=${selectedProjectId}`);
        const data = await res.json();
        setPrompts(data);
      } catch (err) {
        console.error('Failed to load prompts', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrompts();
  }, [selectedProjectId]);

  // 3. Filter Logic
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.optimizedPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProfession = selectedProfession === 'all' || prompt.profession === selectedProfession;
    const matchesStyle = selectedStyle === 'all' || prompt.style === selectedStyle;

    return matchesSearch && matchesProfession && matchesStyle;
  });

  const activeProject = projects.find(p => p._id === selectedProjectId);

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================
            HEADER & PROJECT SWITCHER
            ============================================ */}
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
              
              {/* Custom Project Dropdown */}
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
                              setSelectedProjectId(p._id);
                              setIsProjectMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedProjectId === p._id 
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

        {/* ============================================
            FILTERS BAR
            ============================================ */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Search */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search titles or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-100 border border-glass-border rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent-1 focus:outline-none transition-colors"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Profession Filter */}
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            className="bg-dark-100 border border-glass-border rounded-xl py-3 px-4 text-gray-300 focus:border-accent-1 focus:outline-none appearance-none"
          >
            <option value="all">All Professions</option>
            <option value="developer">💻 Developer</option>
            <option value="marketer">📊 Marketer</option>
            <option value="designer">🎨 Designer</option>
            <option value="writer">✍️ Writer</option>
            <option value="analyst">📈 Analyst</option>
            <option value="manager">🚀 Product Manager</option>
          </select>

          {/* Style Filter */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="bg-dark-100 border border-glass-border rounded-xl py-3 px-4 text-gray-300 focus:border-accent-1 focus:outline-none appearance-none"
          >
            <option value="all">All Frameworks</option>
            <option value="walt">WALT</option>
            <option value="race">RACE</option>
            <option value="cce">CCE</option>
            <option value="custom">Custom</option>
          </select>
        </motion.div>

        {/* ============================================
            PROMPTS GRID
            ============================================ */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-dark-100 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredPrompts.length > 0 ? (
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-dark-100/50 rounded-3xl border border-dashed border-white/10"
          >
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No prompts found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters, or switch to a different project.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedProfession('all');
                setSelectedStyle('all');
              }}
              className="mt-6 text-accent-1 hover:text-accent-2 font-medium transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}