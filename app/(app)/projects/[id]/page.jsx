'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProject } from '@/components/providers/ProjectProvider';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  LayoutDashboard, 
  Loader2,
  FolderOpen,
  Clock,
  FileText
} from 'lucide-react';
import { fadeUp } from '@/components/motion/variants';

export default function ProjectWorkspace({ params }) {
  // Unwrap params for Next.js 16
  const { id } = use(params);
  const router = useRouter();
  const { switchProject, refreshProjects } = useProject();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    async function loadProjectData() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        setProject(data);
        setFormData({ name: data.name, description: data.description || '' });
      } catch (error) {
        toast.error("Could not load project workspace");
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
  }, [id, router]);

  // const handleOpenProject = () => {
  //   switchProject(id); // Set this as the Active Project globally
  //   router.push('/[]'); // Go to the Editor
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Workspace settings saved");
      refreshProjects(); // Update global list
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("⚠️ DANGER: This will delete the project and ALL its prompts permanently. Continue?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Project deleted successfully");
      refreshProjects();
      
      // If this was the active project, clear it
      if (localStorage.getItem('walt_active_project') === id) {
        localStorage.removeItem('walt_active_project');
      }
      
      router.push('/projects');
    } catch (error) {
      toast.error("Delete failed");
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-accent-1" />
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Projects
          </Link>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          
          {/* Workspace Header Card */}
          <div className="glass rounded-2xl p-8 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                 <div className="flex items-center space-x-3 mb-2">
                    <h1 className="font-display text-3xl font-bold text-white">
                      {project.name}
                    </h1>
                    <span className="px-3 py-1 rounded-full bg-accent-1/10 text-accent-1 text-xs font-bold border border-accent-1/20">
                      WORKSPACE
                    </span>
                 </div>
                 <p className="text-gray-400">
                   Manage settings and configurations for this project.
                 </p>
              </div>

               <Link 
                href={`/projects/${id}/workspace`} // Link to main editor or specific project editor if applicable
                className="btn-clay flex items-center space-x-2 px-8 py-4 text-lg shadow-glow-indigo"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Open Editor</span>
              </Link>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-white/5 rounded-lg text-purple-400"><FileText className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Prompts</div>
                  <div className="font-bold">{project.stats?.promptCount || 0}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-white/5 rounded-lg text-orange-400"><Clock className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Last Active</div>
                  <div className="font-bold">
                    {new Date(project.stats?.lastActive || project.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-white/5 rounded-lg text-blue-400"><FolderOpen className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Status</div>
                  <div className="font-bold">Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="glass rounded-2xl p-8 border border-white/10">
            <h2 className="font-display text-xl font-bold text-white mb-6">Project Settings</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-inset w-full bg-dark-100"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-inset w-full bg-dark-100 h-32 resize-none"
                    placeholder="Describe the goal of this project..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-500/10"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete Project</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium transition-all border border-white/5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

        </motion.div>
      </div>
    </div>
  );
}