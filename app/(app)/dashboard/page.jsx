// app/(app)/dashboard/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Composer from '@/components/Composer';
import VaultCard from '@/components/VaultCard';
import { fadeUp, staggerContainer, staggerItem, scaleIn } from '@/components/motion/variants';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectPrompts, setProjectPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Fetch Projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Prompts when Project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchPrompts(selectedProjectId);
    } else {
      setProjectPrompts([]);
    }
  }, [selectedProjectId]);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      // Default to first project if none selected
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPrompts(projectId) {
    try {
      const res = await fetch(`/api/vault?projectId=${projectId}`);
      const data = await res.json();
      setProjectPrompts(data);
    } catch (err) {
      console.error('Failed to load prompts', err);
    }
  }

  async function createProject() {
    if (!newProjectName.trim()) return;
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: 'New workspace' }),
      });
      const project = await res.json();
      setProjects([project, ...projects]);
      setSelectedProjectId(project._id);
      setNewProjectName('');
      setIsCreatingProject(false);
    } catch (err) {
      alert('Error creating project');
    }
  }

  const activeProject = projects.find(p => p._id === selectedProjectId);

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================
            WORKSPACE HEADER
            ============================================ */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        >
          <div>
            <h2 className="text-sm font-semibold text-accent-1 tracking-wider uppercase mb-2">
              Active Workspace
            </h2>
            
            {/* Custom Project Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                className="flex items-center space-x-3 text-3xl font-display font-bold text-white hover:text-gray-200 transition-colors group"
              >
                <span>{activeProject?.name || 'Select Project'}</span>
                <motion.span 
                  animate={{ rotate: isProjectMenuOpen ? 180 : 0 }}
                  className="text-gray-500 group-hover:text-accent-1 transition-colors text-xl"
                >
                  ▼
                </motion.span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProjectMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-4 w-72 bg-dark-100 border border-glass-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase">
                        Switch Project
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {projects.map(p => (
                          <button
                            key={p._id}
                            onClick={() => {
                              setSelectedProjectId(p._id);
                              setIsProjectMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                              selectedProjectId === p._id 
                                ? 'bg-accent-1/10 text-accent-1' 
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {selectedProjectId === p._id && <span>✓</span>}
                          </button>
                        ))}
                      </div>
                      
                      {/* New Project Button inside Dropdown */}
                      <div className="border-t border-white/10 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setIsProjectMenuOpen(false);
                            setIsCreatingProject(true);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <span className="text-lg">+</span>
                          <span>Create New Project</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Stats or Actions */}
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 rounded-full bg-dark-100 border border-white/5 text-sm text-gray-400">
              <span className="text-white font-bold">{projectPrompts.length}</span> Prompts
            </div>
          </div>
        </motion.div>

        {/* ============================================
            CREATE PROJECT MODAL (Overlay)
            ============================================ */}
        <AnimatePresence>
          {isCreatingProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-dark-100 border border-glass-border rounded-2xl p-8 w-full max-w-md shadow-2xl"
              >
                <h3 className="font-display text-2xl font-bold text-white mb-2">Create New Workspace</h3>
                <p className="text-gray-400 mb-6">Give your new project a name to get started.</p>
                
                <input
                  type="text"
                  placeholder="e.g. Marketing Campaign Q4"
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-accent-1 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && createProject()}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCreatingProject(false)}
                    className="flex-1 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createProject}
                    className="flex-1 btn-clay rounded-xl"
                  >
                    Create Project
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================
            MAIN GRID LAYOUT
            ============================================ */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Composer */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <div className="glass rounded-glass p-1 border-t border-white/10 shadow-xl">
                <div className="bg-dark-200/50 rounded-[14px] p-6 lg:p-8">
                  <Composer 
                    projectId={selectedProjectId} 
                    onSave={() => fetchPrompts(selectedProjectId)} 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Recent Vault Items */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">
                  Recent Saves
                </h3>
                <button className="text-xs text-accent-1 hover:text-accent-2 transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {projectPrompts.length === 0 ? (
                  <div className="text-center py-10 px-6 rounded-xl border border-dashed border-white/10">
                    <span className="text-4xl block mb-3">📂</span>
                    <p className="text-gray-500 text-sm">Your vault is empty.</p>
                    <p className="text-gray-600 text-xs mt-1">Create your first optimization!</p>
                  </div>
                ) : (
                  projectPrompts.map((prompt) => (
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