'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // ✅ FIX 1: Import Link
import { motion } from 'framer-motion';
import Composer from '@/components/prompt/Composer';
import VaultCard from '@/components/vault/VaultCard';
import { useProject } from '@/components/providers/ProjectProvider'; // ✅ FIX 2: Connect to Global State
import { fadeUp, staggerContainer, staggerItem, revealOnScroll, viewportOptions } from '@/components/motion/variants';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  // Use the global project data we already have!
  const { activeProject, projects } = useProject();
  
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [stats, setStats] = useState({
    totalPrompts: 0,
    tokensSaved: 0,
    optimizationsToday: 0,
  });

  // Fetch data based on ACTIVE PROJECT
  useEffect(() => {
    async function fetchDashboardData() {
      if (!activeProject) {
        setIsLoadingPrompts(false);
        return;
      }

      setIsLoadingPrompts(true);
      try {
        // Fetch prompts for the specific project
        const response = await fetch(`/api/vault?projectId=${activeProject._id}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Get latest 3 prompts
          setRecentPrompts(data.slice(0, 3));

          // Calculate stats dynamically
          setStats({
            totalPrompts: data.length,
            // Mock calculation for tokens saved based on prompt length
            tokensSaved: data.reduce((sum, p) => sum + Math.ceil((p.optimizedPrompt?.length || 0) / 4), 0),
            optimizationsToday: data.filter(p => {
              const today = new Date().toDateString();
              const promptDate = new Date(p.createdAt).toDateString();
              return today === promptDate;
            }).length,
          });
        }
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      } finally {
        setIsLoadingPrompts(false);
      }
    }

    fetchDashboardData();
  }, [activeProject]); // Re-run when project switches

  const handleViewPrompt = (id) => {
    router.push(`/vault/${id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================
            WELCOME HEADER
            ============================================ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h1 className="font-display text-display-md font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-gray-300">
         Ready to create some amazing prompts today?
          </p>
        </motion.div>

        {/* ============================================
            STATS CARDS
            ============================================ */}
        {/* <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatCard
            icon="📦"
            label="Total Prompts"
            value={stats.totalPrompts}
            trend={`${projects.length} active projects`}
            color="from-accent-1 to-purple-600"
          />
          <StatCard
            icon="⚡"
            label="Tokens Saved"
            value={stats.tokensSaved.toLocaleString()}
            trend="Estimated Usage"
            color="from-accent-2 to-orange-500"
          />
          <StatCard
            icon="✨"
            label="Today's Optimizations"
            value={stats.optimizationsToday}
            trend="Keep going!"
            color="from-accent-3 to-yellow-500"
          />
        </motion.div> */}

        {/* ============================================
            MAIN CONTENT GRID
            ============================================ */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Quick Composer */}
          <div className="lg:col-span-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-white">
                  Quick Composer
                </h2>
                {/* ✅ FIX: Use Link for internal navigation */}
                <Link
                  href="/vault"
                  className="text-sm text-accent-1 hover:text-accent-2 font-medium transition-colors"
                >
                  View Vault →
                </Link>
              </div>

              <div className="glass rounded-glass p-6 lg:p-8">
                {activeProject ? (
                  <Composer projectId={activeProject._id} compact={true} onSave={() => {/* Optional refresh */}} />
                ) : (
                  <div className="text-center py-10 text-gray-400">Select a project to start composing</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Quick Actions */}
          <div className="lg:col-span-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Actions Card */}
              <div className="glass rounded-glass p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <QuickActionButton icon="🔍" label="Browse Vault" href="/vault" />
                  <QuickActionButton icon="📚" label="Framework Guide" href="#frameworks" />
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass rounded-glass p-6 border border-accent-1/20">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Pro Tip</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Use the <strong>WALT</strong> framework (Who, Action, Limitation, Tone) for the most precise results in GPT-4.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============================================
            RECENT PROMPTS SECTION
            ============================================ */}
        <motion.div
          id="vault"
          variants={revealOnScroll}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Recent Prompts
            </h2>
            <Link
              href="/vault"
              className="text-sm text-accent-1 hover:text-accent-2 font-medium transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Loading State */}
          {isLoadingPrompts && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingPrompts && recentPrompts.length === 0 && (
            <div className="glass rounded-glass p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                No Prompts Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Use the composer above to create and save your first optimized prompt.
              </p>
            </div>
          )}

          {/* Recent Prompts Grid */}
          {!isLoadingPrompts && recentPrompts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentPrompts.map((prompt) => (
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
                    onClick={() => handleViewPrompt(prompt._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ============================================
            FRAMEWORKS SECTION
            ============================================ */}
        <motion.div
          id="frameworks"
          variants={revealOnScroll}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          className="mt-16"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            Framework Quick Reference
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FrameworkCard name="WALT" description="Who, Action, Limitation, Tone" color="from-accent-1 to-purple-600" />
            <FrameworkCard name="RACE" description="Role, Action, Context, Expectation" color="from-accent-2 to-orange-500" />
            <FrameworkCard name="CCE" description="Context, Constraint, Example" color="from-accent-3 to-yellow-500" />
            <FrameworkCard name="Custom" description="Free-form optimization" color="from-green-500 to-teal-500" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Sub Components (Keep in same file for simplicity) ---

function StatCard({ icon, label, value, trend, color }) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass rounded-glass p-6 hover:bg-glass-hover transition-all cursor-pointer group"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-xs text-accent-1">{trend}</div>
    </motion.div>
  );
}

function QuickActionButton({ icon, label, href }) {
  // Check if it is an anchor link (#) or a page route (/)
  const isAnchor = href.startsWith('#');

  // ✅ FIX 3: Conditionally render Link or a tag
  if (isAnchor) {
     return (
      <a
        href={href}
        className="flex items-center space-x-3 p-3 rounded-xl glass border border-glass-border hover:border-accent-1/30 hover:bg-glass-hover transition-all group"
      >
        <span className="text-2xl">{icon}</span>
        <span className="font-medium text-white group-hover:text-accent-1 transition-colors">{label}</span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-3 rounded-xl glass border border-glass-border hover:border-accent-1/30 hover:bg-glass-hover transition-all group"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-white group-hover:text-accent-1 transition-colors">{label}</span>
    </Link>
  );
}

function FrameworkCard({ name, description, color }) {
  return (
    <motion.div
      className="glass rounded-glass p-4 hover:bg-glass-hover transition-all group cursor-pointer"
      whileHover={{ y: -4 }}
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <span className="text-white font-bold text-sm">{name[0]}</span>
      </div>
      <h4 className="font-display font-bold text-white mb-1">{name}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-glass p-6 animate-pulse">
      <div className="w-8 h-8 bg-gray-700 rounded mb-3" />
      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-700 rounded w-full mb-4" />
    </div>
  );
}