'use client';

/**
 * ============================================
 * NAVBAR COMPONENT
 * ============================================
 * 
 * Features:
 * - Glassmorphism background with blur
 * - Magnetic hover effect on primary CTA
 * - Responsive mobile menu (hamburger)
 * - Smooth scroll to sections
 * - Active state indicators
 */

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { slideInRight, fadeIn } from './motion/variants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect (add backdrop blur when scrolled)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close mobile menu when clicking a link
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-glass-bg backdrop-blur-glass border-b border-glass-border shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center space-x-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center shadow-glow-indigo">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-display font-bold text-xl text-white hidden sm:block">
                WALT Studio
              </span>
            </motion.a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/dashboard#vault">Vault</NavLink>
            </div>

            {/* Desktop CTA Button (with magnetic effect) */}
            <div className="hidden md:block">
              <MagneticButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white rounded-full"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-dark-100 border-l border-glass-border z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-8">
                {/* Mobile Logo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">W</span>
                    </div>
                    <span className="font-display font-bold text-xl text-white">
                      WALT Studio
                    </span>
                  </div>
                  <button
                    onClick={closeMenu}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-4">
                  <MobileNavLink href="#features" onClick={closeMenu}>
                    Features
                  </MobileNavLink>
                  <MobileNavLink href="#pricing" onClick={closeMenu}>
                    Pricing
                  </MobileNavLink>
                  <MobileNavLink href="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/dashboard#vault" onClick={closeMenu}>
                    Vault
                  </MobileNavLink>
                </nav>

                {/* Mobile CTA */}
                <div className="pt-4">
                  <motion.a
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block w-full btn-clay text-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started Free
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// DESKTOP NAV LINK COMPONENT
// ============================================
function NavLink({ href, children }) {
  return (
    <motion.a
      href={href}
      className="text-gray-300 hover:text-white font-medium transition-colors relative group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {/* Underline animation */}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-1 to-accent-2 group-hover:w-full transition-all duration-300" />
    </motion.a>
  );
}

// ============================================
// MOBILE NAV LINK COMPONENT
// ============================================
function MobileNavLink({ href, onClick, children }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className="block text-lg font-medium text-gray-300 hover:text-white transition-colors py-2"
      whileHover={{ x: 8 }}
      transition={{ duration: 0.2 }}
    >
      <span className="flex items-center space-x-3">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-1" />
        <span>{children}</span>
      </span>
    </motion.a>
  );
}

// ============================================
// MAGNETIC BUTTON COMPONENT
// ============================================
function MagneticButton() {
  const ref = useRef(null);
  
  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring animation for smooth magnetic pull
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Handle mouse move for magnetic effect
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Apply magnetic pull (max 12px in each direction)
    const maxDistance = 60; // Trigger distance
    const pullStrength = 0.2; // How strong the magnetic effect is
    
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < maxDistance) {
      x.set(distanceX * pullStrength);
      y.set(distanceY * pullStrength);
    }
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="/dashboard"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="btn-clay relative inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Get Started Free
      
      {/* Animated arrow icon */}
      <motion.svg
        className="inline-block ml-2 w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </motion.svg>
    </motion.a>
  );
}