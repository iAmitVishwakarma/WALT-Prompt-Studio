'use client';

/**
 * ============================================
 * DASHBOARD PAGE
 * ============================================
 * 
 * Features:
 * - Welcome header with user greeting
 * - Stats cards (total prompts, tokens saved, etc.)
 * - Quick Composer (compact version)
 * - Recent Prompts preview (latest 3 from vault)
 * - Quick actions shortcuts
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Composer from '@/components/Composer';
import VaultCard from '@/components/VaultCard';
import { fadeUp, staggerContainer, staggerItem, revealOnScroll, viewportOptions } from '@/components/motion/variants';

export default function DashboardPage() {
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [stats, setStats] = useState({
    totalPrompts: 0,
    tokensSaved: 0,
    optimizationsToday: 0,
  });

  // Fetch recent prompts from vault
  useEffect(() => {
    async function fetchRecentPrompts() {
      try {
        const response = await fetch('/api/vault');
        const data = await response.json();
        
        // Get latest 3 prompts
        const recent = data.slice(0, 3);
        setRecentPrompts(recent);

        // Calculate stats
        setStats({
          totalPrompts: data.length,
          tokensSaved: data.reduce((sum, p) => sum + Math.ceil(p.optimizedPrompt?.length / 4 || 0), 0),
          optimizationsToday: data.filter(p => {
            const today = new Date().toDateString();
            const promptDate = new Date(p.createdAt).toDateString();
            return today === promptDate;
          }).length,
        });

      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      } finally {
        setIsLoadingPrompts(false);
      }
    }

    fetchRecentPrompts();
  }, []);

  // Handle view prompt
  const handleViewPrompt = (id) => {
    // TODO: Navigate to prompt detail page or open modal
    console.log('View prompt:', id);
    alert(`Viewing prompt ${id} - Detail page coming in v2!`);
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
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatCard
            icon="📦"
            label="Total Prompts"
            value={stats.totalPrompts}
            trend="+2 this week"
            color="from-accent-1 to-purple-600"
          />
          <StatCard
            icon="⚡"
            label="Tokens Saved"
            value={stats.tokensSaved.toLocaleString()}
            trend="~$0.05 saved"
            color="from-accent-2 to-orange-500"
          />
          <StatCard
            icon="✨"
            label="Today's Optimizations"
            value={stats.optimizationsToday}
            trend="Keep going!"
            color="from-accent-3 to-yellow-500"
          />
        </motion.div>

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
                <a
                  href="#vault"
                  className="text-sm text-accent-1 hover:text-accent-2 font-medium transition-colors"
                >
                  View Vault →
                </a>
              </div>

              <div className="glass rounded-glass p-6 lg:p-8">
                <Composer compact={true} />
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
                  <QuickActionButton
                    icon="🔍"
                    label="Browse Vault"
                    href="#vault"
                  />
                  <QuickActionButton
                    icon="📚"
                    label="Framework Guide"
                    href="#frameworks"
                  />
                  <QuickActionButton
                    icon="⚙️"
                    label="Settings"
                    href="#settings"
                  />
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass rounded-glass p-6 border border-accent-1/20">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Pro Tip
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Use the WALT framework for structured prompts. It helps define <strong>Who</strong> you are, the <strong>Action</strong> needed, <strong>Limitations</strong>, and <strong>Tone</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Card */}
              <div className="glass rounded-glass p-6">
                <h4 className="font-semibold text-white mb-3">
                  This Month
                </h4>
                <div className="space-y-3">
                  <UsageBar
                    label="Optimizations"
                    current={stats.optimizationsToday}
                    max={50}
                    color="bg-accent-1"
                  />
                  <UsageBar
                    label="Vault Storage"
                    current={stats.totalPrompts}
                    max={10}
                    color="bg-accent-2"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Free plan: 50 optimizations/month, 10 vault prompts
                </p>
                <motion.a
                  href="#pricing"
                  className="block mt-3 text-center py-2 px-4 rounded-xl bg-gradient-to-r from-accent-1 to-accent-2 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upgrade to Pro
                </motion.a>
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
            <a
              href="/vault"
              className="text-sm text-accent-1 hover:text-accent-2 font-medium transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
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
                <motion.div key={prompt.id} variants={staggerItem}>
                  <VaultCard
                    id={prompt.id}
                    title={prompt.title}
                    snippet={prompt.snippet}
                    profession={prompt.profession}
                    style={prompt.style}
                    tags={prompt.tags}
                    version={prompt.version}
                    createdAt={prompt.createdAt}
                    onClick={() => handleViewPrompt(prompt.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ============================================
            FRAMEWORKS SECTION (Quick Reference)
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
            <FrameworkCard
              name="WALT"
              description="Who, Action, Limitation, Tone"
              color="from-accent-1 to-purple-600"
            />
            <FrameworkCard
              name="RACE"
              description="Role, Action, Context, Expectation"
              color="from-accent-2 to-orange-500"
            />
            <FrameworkCard
              name="CCE"
              description="Context, Constraint, Example"
              color="from-accent-3 to-yellow-500"
            />
            <FrameworkCard
              name="Custom"
              description="Free-form optimization"
              color="from-green-500 to-teal-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// STAT CARD COMPONENT
// ============================================

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
      <div className="text-3xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-400 mb-2">
        {label}
      </div>
      <div className="text-xs text-accent-1">
        {trend}
      </div>
    </motion.div>
  );
}

// ============================================
// QUICK ACTION BUTTON
// ============================================

function QuickActionButton({ icon, label, href }) {
  return (
    <motion.a
      href={href}
      className="flex items-center space-x-3 p-3 rounded-xl glass border border-glass-border hover:border-accent-1/30 hover:bg-glass-hover transition-all group"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-white group-hover:text-accent-1 transition-colors">
        {label}
      </span>
      <svg className="w-4 h-4 text-gray-400 ml-auto group-hover:text-accent-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.a>
  );
}

// ============================================
// USAGE BAR COMPONENT
// ============================================

function UsageBar({ label, current, max, color }) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">
          {current} / {max}
        </span>
      </div>
      <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ============================================
// FRAMEWORK CARD
// ============================================

function FrameworkCard({ name, description, color }) {
  return (
    <motion.div
      className="glass rounded-glass p-4 hover:bg-glass-hover transition-all group cursor-pointer"
      whileHover={{ y: -4 }}
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <span className="text-white font-bold text-sm">{name[0]}</span>
      </div>
      <h4 className="font-display font-bold text-white mb-1">
        {name}
      </h4>
      <p className="text-xs text-gray-400">
        {description}
      </p>
    </motion.div>
  );
}

// ============================================
// SKELETON LOADING CARD
// ============================================

function SkeletonCard() {
  return (
    <div className="glass rounded-glass p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded" />
          <div className="w-16 h-4 bg-gray-700 rounded" />
        </div>
        <div className="w-8 h-6 bg-gray-700 rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-5 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="w-16 h-6 bg-gray-700 rounded-full" />
        <div className="w-20 h-6 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}