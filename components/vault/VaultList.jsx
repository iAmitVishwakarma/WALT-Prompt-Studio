'use client';

/**
 * ============================================
 * VAULT LIST COMPONENT
 * ============================================
 * 
 * Features:
 * - Search bar with real-time filtering
 * - Filter by profession and style
 * - Grid layout with stagger animation
 * - Empty state handling
 * - Loading state
 * - Responsive design
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VaultCard from './VaultCard';
import { staggerContainer, staggerItem, fadeUp } from '../motion/variants';

// ============================================
// FILTER OPTIONS
// ============================================

const PROFESSION_FILTERS = [
  { id: 'all', label: 'All Professions', icon: '🌐' },
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'marketer', label: 'Marketer', icon: '📊' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'writer', label: 'Writer', icon: '✍️' },
  { id: 'analyst', label: 'Data Analyst', icon: '📈' },
  { id: 'manager', label: 'Product Manager', icon: '🚀' },
];

const STYLE_FILTERS = [
  { id: 'all', label: 'All Styles' },
  { id: 'walt', label: 'WALT' },
  { id: 'race', label: 'RACE' },
  { id: 'cce', label: 'CCE' },
  { id: 'custom', label: 'Custom' },
];

// ============================================
// MAIN VAULT LIST COMPONENT
// ============================================

export default function VaultList({ 
  prompts = [],
  isLoading = false,
  onPromptClick 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [filteredPrompts, setFilteredPrompts] = useState(prompts);

  // Filter prompts when search/filters change
  useEffect(() => {
    let filtered = [...prompts];

    // Search filter (title, snippet, tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt => 
        prompt.title?.toLowerCase().includes(query) ||
        prompt.snippet?.toLowerCase().includes(query) ||
        prompt.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Profession filter
    if (selectedProfession !== 'all') {
      filtered = filtered.filter(prompt => 
        prompt.profession === selectedProfession
      );
    }

    // Style filter
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(prompt => 
        prompt.style === selectedStyle
      );
    }

    setFilteredPrompts(filtered);
  }, [searchQuery, selectedProfession, selectedStyle, prompts]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedProfession('all');
    setSelectedStyle('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedProfession !== 'all' || selectedStyle !== 'all';

  return (
    <div className="space-y-6">
      
      {/* ============================================
          SEARCH & FILTERS SECTION
          ============================================ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts by title, tags, or content..."
            className="input-inset w-full pl-12 pr-4 py-4"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Profession Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Profession
            </label>
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="input-inset w-full"
            >
              {PROFESSION_FILTERS.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.icon} {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Style Framework
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="input-inset w-full"
            >
              {STYLE_FILTERS.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <motion.button
                onClick={handleClearFilters}
                className="glass px-4 py-3 rounded-xl font-medium text-white hover:bg-glass-hover transition-all whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                ✕ Clear Filters
              </motion.button>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-400"
          >
            <span>Showing {filteredPrompts.length} of {prompts.length} prompts</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-accent-1/20 rounded text-accent-1">
                Search: "{searchQuery}"
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* ============================================
          LOADING STATE
          ============================================ */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ============================================
          EMPTY STATE
          ============================================ */}
      {!isLoading && filteredPrompts.length === 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center py-16"
        >
          <div className="glass rounded-glass p-12 max-w-md mx-auto">
            {hasActiveFilters ? (
              <>
                {/* No results for filters */}
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  No Prompts Found
                </h3>
                <p className="text-gray-400 mb-6">
                  No prompts match your current filters. Try adjusting your search criteria.
                </p>
                <motion.button
                  onClick={handleClearFilters}
                  className="btn-clay"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All Filters
                </motion.button>
              </>
            ) : (
              <>
                {/* Empty vault */}
                <div className="text-6xl mb-4">📦</div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Your Vault is Empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Start optimizing prompts and save them here for future use.
                </p>
                <motion.a
                  href="/dashboard"
                  className="btn-clay inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Your First Prompt
                </motion.a>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ============================================
          PROMPTS GRID
          ============================================ */}
      {!isLoading && filteredPrompts.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                variants={staggerItem}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <VaultCard
                  id={prompt.id}
                  title={prompt.title}
                  snippet={prompt.snippet}
                  profession={prompt.profession}
                  style={prompt.style}
                  tags={prompt.tags}
                  version={prompt.version}
                  createdAt={prompt.createdAt}
                  onClick={() => onPromptClick?.(prompt.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
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
        <div className="h-4 bg-gray-700 rounded w-2/3" />
      </div>

      <div className="flex gap-2 mb-4">
        <div className="w-16 h-6 bg-gray-700 rounded-full" />
        <div className="w-20 h-6 bg-gray-700 rounded-full" />
        <div className="w-16 h-6 bg-gray-700 rounded-full" />
      </div>

      <div className="flex justify-between pt-3 border-t border-glass-border">
        <div className="w-24 h-4 bg-gray-700 rounded" />
        <div className="w-20 h-4 bg-gray-700 rounded" />
      </div>
    </div>
  );
}