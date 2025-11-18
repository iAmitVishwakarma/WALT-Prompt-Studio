'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Projects when session loads
  useEffect(() => {
    if (session?.user) {
      fetchProjects();
    } else {
      setProjects([]);
      setActiveProject(null);
      setIsLoading(false);
    }
  }, [session]);

  async function fetchProjects() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      
      if (res.ok) {
        setProjects(data);
        // Restore active project from local storage OR default to first
        const savedId = localStorage.getItem('walt_active_project');
        const found = data.find(p => p._id === savedId) || data[0];
        setActiveProject(found || null);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
      toast.error("Could not load projects");
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Switch Active Project
  const switchProject = (projectId) => {
    const project = projects.find(p => p._id === projectId);
    if (project) {
      setActiveProject(project);
      localStorage.setItem('walt_active_project', projectId); // Persist selection
    }
  };

  // 3. Create New Project
  const createProject = async (name, description = '') => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      
      const newProject = await res.json();
      if (res.ok) {
        setProjects([newProject, ...projects]);
        setActiveProject(newProject); // Auto-select new project
        toast.success("Project created!");
        return true;
      } else {
        throw new Error(newProject.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create project");
      return false;
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      activeProject, 
      isLoading, 
      switchProject, 
      createProject,
      refreshProjects: fetchProjects 
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);