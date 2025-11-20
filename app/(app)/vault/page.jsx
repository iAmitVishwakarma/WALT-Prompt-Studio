'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProject } from '@/components/providers/ProjectProvider';
import VaultCard from '@/components/vault/VaultCard';
import { fadeUp, staggerContainer, staggerItem } from '@/components/motion/variants';
import { Filter, Search, X } from 'lucide-react';

export default function VaultPage() {
  // We use global projects list for the filter dropdown
  const { projects } = useProject(); 
  
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all'); // 'all' or projectId

  // Fetch ALL prompts initially
  useEffect(() => {
    async function fetchAllPrompts() {
      try {
        const res = await fetch('/api/vault'); // Now returns all user prompts
        const data = await res.json();
        if (Array.isArray(data)) setPrompts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllPrompts();
  }, []);

  // Client-side filtering (Fast & Responsive)
  const filteredPrompts = prompts.filter(prompt => {
    // 1. Text Search
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.snippet?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Project Filter
    const matchesProject = filterProject === 'all' || prompt.projectId === filterProject;

    return matchesSearch && matchesProject;
  });

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
               <h1 className="font-display text-4xl font-bold text-white mb-2">Global Vault</h1>
               <p className="text-gray-400">All your optimized prompts in one place.</p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                {/* Project Filter Dropdown */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select 
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="input-inset pl-10 pr-8 py-2.5 appearance-none cursor-pointer min-w-[200px]"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search prompts..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-inset pl-10 py-2.5 w-full sm:w-64"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
             </div>
          </div>
        </motion.div>

        {/* Prompts Grid */}
        {loading ? (
           <div className="text-center py-20 text-gray-500">Loading Vault...</div>
        ) : filteredPrompts.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10">
             <div className="text-gray-500">No prompts found matching your filters.</div>
          </div>
        )}

      </div>
    </div>
  );
}