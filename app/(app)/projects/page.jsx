'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProject } from '@/components/providers/ProjectProvider';
import { fadeUp, staggerContainer, staggerItem, scaleIn } from '@/components/motion/variants';
import { 
  Plus, 
  Folder, 
  ArrowRight, 
  Loader2, 
  Settings, 
  Layout,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, createProject, isLoading } = useProject();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PROJECT_LIMIT = 2;

  // Navigation Handlers
  const goToWorkspace = (projectId) => router.push(`/projects/${projectId}/workspace`);
  const goToSettings = (projectId) => router.push(`/projects/${projectId}`);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDescription.trim()) return;
  

    // 🛑 Limit Check
    if (projects.length >= PROJECT_LIMIT) {
      toast.error(`Free plan limit reached (${PROJECT_LIMIT} projects).`);
      return;
    }
    
    setIsSubmitting(true);
    const success = await createProject(newProjectName, newProjectDescription);
    setIsSubmitting(false);
    
    if (success) {
      setNewProjectName('');
      setNewProjectDescription('');
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-1" /></div>;
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Your Projects</h1>
            <p className="text-gray-400 text-lg">Manage your dedicated workspaces.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <span className={`text-sm font-medium ${projects.length >= PROJECT_LIMIT ? 'text-red-400' : 'text-gray-500'}`}>
              {projects.length} / {PROJECT_LIMIT} Projects Used
            </span>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create Card */}
          <motion.div 
            variants={staggerItem}
            onClick={() => {
              if (projects.length >= PROJECT_LIMIT) {
                 toast.error("Project limit reached");
              } else {
                 setIsCreating(true);
              }
            }}
            className={`group relative h-60 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
               projects.length >= PROJECT_LIMIT 
               ? 'border-red-500/20 bg-red-500/5 opacity-75 cursor-not-allowed' 
               : 'border-white/10 hover:border-accent-1/50 hover:bg-white/5'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all ${
               projects.length >= PROJECT_LIMIT ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-gray-400 group-hover:bg-accent-1 group-hover:text-white'
            }`}>
              {projects.length >= PROJECT_LIMIT ? <AlertCircle className="w-7 h-7"/> : <Plus className="w-7 h-7" />}
            </div>
            <span className={`font-medium text-lg ${projects.length >= PROJECT_LIMIT ? 'text-red-400' : 'text-gray-400 group-hover:text-white'}`}>
              {projects.length >= PROJECT_LIMIT ? "Limit Reached" : "Create New Project"}
            </span>
          </motion.div>

          {/* Project Cards */}
          {projects.map((project) => (
            <motion.div
              key={project._id}
              variants={staggerItem}
              className="group relative h-60 glass rounded-2xl p-6 flex flex-col justify-between border border-white/5 hover:border-accent-1/30 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-1/20 to-purple-500/20 text-accent-1">
                    <Folder className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToSettings(project._id); }}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Project Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 truncate font-display">{project.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{project.description || "No description"}</p>
              </div>
              
              <button 
                onClick={() => goToWorkspace(project._id)}
                className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-accent-1 hover:text-white text-gray-300 font-medium text-sm transition-all flex items-center justify-center group-hover:shadow-lg"
              >
                <Layout className="w-4 h-4 mr-2" />
                Open Workspace
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsCreating(false)}>
              <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="hidden" onClick={(e) => e.stopPropagation()} className="bg-dark-100 border border-glass-border rounded-2xl p-8 shadow-2xl">
                <h3 className="font-display text-2xl font-bold text-white mb-2">New Project</h3>
                <p className="text-gray-400 mb-6">Create a dedicated workspace for your prompts.</p>
                <form onSubmit={handleCreate}>
                  <input type="text" placeholder="e.g. Blog Generator" autoFocus value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="input-inset w-full mb-6" />
                <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="input-inset w-full bg-dark-100 h-30 mb-10  resize-none"
                    placeholder="Describe the goal of this project..."
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsCreating(false)} className=" flex-1 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-900/50">Cancel</button>
                    <button type="submit" disabled={!newProjectName.trim() || isSubmitting} className="flex-1 btn-clay rounded-xl flex justify-center">{isSubmitting ? <Loader2 className="animate-spin" /> : "Create"}</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}