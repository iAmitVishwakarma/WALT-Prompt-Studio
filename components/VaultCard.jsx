'use client';

/**
 * ============================================
 * VAULT CARD COMPONENT
 * ============================================
 * 
 * Features:
 * - Glassmorphism card design
 * - Spotlight hover effect (radial gradient follows mouse)
 * - Display prompt title, snippet, tags
 * - Version indicator
 * - Click to view details
 * - Lift animation on hover
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { lift } from './motion/variants';

export default function VaultCard({ 
  id,
  title, 
  snippet, 
  profession, 
  style, 
  tags = [], 
  version = 1,
  createdAt,
  onClick 
}) {
  const cardRef = useRef(null);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse move for spotlight effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightPosition({ x, y });
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get profession emoji
  const getProfessionEmoji = (prof) => {
    const emojiMap = {
      developer: '💻',
      marketer: '📊',
      designer: '🎨',
      writer: '✍️',
      analyst: '📈',
      manager: '🚀',
      other: '👤',
    };
    return emojiMap[prof] || '📝';
  };

  // Get style badge color
  const getStyleColor = (styleId) => {
    const colorMap = {
      walt: 'from-accent-1 to-purple-600',
      race: 'from-accent-2 to-orange-500',
      cce: 'from-accent-3 to-yellow-500',
      custom: 'from-green-500 to-teal-500',
    };
    return colorMap[styleId] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      ref={cardRef}
      variants={lift}
      initial="rest"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative glass rounded-glass p-6 cursor-pointer overflow-hidden group"
      style={{
        position: 'relative',
      }}
    >
      {/* Spotlight Effect (Radial Gradient following mouse) */}
      {isHovering && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${spotlightPosition.x}px ${spotlightPosition.y}px, rgba(79, 70, 229, 0.15), transparent)`,
          }}
        />
      )}

      {/* Card Content (relative to spotlight) */}
      <div className="relative z-10">
        
        {/* Header: Profession Icon + Version Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getProfessionEmoji(profession)}</span>
            <span className="text-xs font-medium text-gray-400 capitalize">
              {profession || 'General'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Version badge */}
            <span className="px-2 py-1 text-xs font-semibold bg-dark-100/80 rounded-lg text-gray-300 border border-glass-border">
              v{version}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-1 transition-colors">
          {title}
        </h3>

        {/* Snippet */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {snippet}
        </p>

        {/* Tags & Style */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Style Framework Badge */}
          {style && (
            <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${getStyleColor(style)} text-white shadow-sm`}>
              {style.toUpperCase()}
            </span>
          )}

          {/* Tags */}
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-glass-bg rounded-full text-gray-300 border border-glass-border"
            >
              #{tag}
            </span>
          ))}

          {/* More tags indicator */}
          {tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{tags.length - 3} more
            </span>
          )}
        </div>

        {/* Footer: Date + Action Hint */}
        <div className="flex items-center justify-between pt-3 border-t border-glass-border">
          <span className="text-xs text-gray-500">
            {formatDate(createdAt)}
          </span>
          
          <motion.div
            className="flex items-center space-x-1 text-xs text-accent-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <span>View details</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Gradient Border Glow (appears on hover) */}
      <div className="absolute inset-0 rounded-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-glass border border-accent-1/30" />
      </div>
    </motion.div>
  );
}