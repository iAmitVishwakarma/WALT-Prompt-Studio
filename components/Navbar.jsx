// components/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight, fadeIn, heroReveal } from './motion/variants';
import Link from 'next/link';
import { Router } from 'next/router';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname(); // Get current path

  // Check if we are on the dashboard
const islandingPage = pathname.trim() === '/';
const isAuthPages = pathname.trim() === '/login' || pathname.trim() === '/register' || pathname.trim() === '/forgot-password' || pathname.trim() === '/reset-password';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          !islandingPage
            ? 'bg-dark-200 border-b border-glass-border' // Solid background for Dashboard
            : isScrolled 
              ? 'bg-glass-bg backdrop-blur-glass border-b border-glass-border shadow-lg' 
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center shadow-glow-indigo">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-display font-bold text-xl text-white hidden sm:block">
                WALT Studio
              </span>
            </Link>

            {/* Desktop Nav */}
      
              {islandingPage ? (
                <>
    
                <div className="hidden md:flex items-center space-x-16 ">
                  <NavLink href="/#features">Features</NavLink>
                <NavLink href="/#pricing">Pricing</NavLink>
            <NavLink href="/#blog">Blog</NavLink>
                </div>
                <Link href="/dashboard" className="hidden md:inline-flex items-center px-7 py-2  bg-gradient-to-br from-accent-2/20 to-accent-3/40  text-white hover:rounded-xl rounded-full hover:bg-black/50 transition-colors shadow-glow-indigo font-medium">
                  Go to Dashboard
                </Link>
                 </>
              ) : (
            // Dashboard-specific links
            <>
            {!isAuthPages ? (
           <>
              <div className="hidden md:flex items-center space-x-16 ">
                <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/vault">Vault</NavLink>
            </div>
            <Link href="/profile" className="hidden md:inline-flex items-center px-7 py-2  bg-gradient-to-br from-accent-2/20 to-accent-3/40  text-white hover:rounded-xl rounded-full hover:bg-black/50 transition-colors shadow-glow-indigo font-medium">
                  Profile
                </Link>
            </> ) : <> </>
              }
            </>
         )}

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 focus:outline-none">
              <motion.span animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-white rounded-full" />
              <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-0.5 bg-white rounded-full" />
              <motion.span animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={fadeIn}
              initial="hidden" animate="visible" exit="hidden"
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              variants={slideInRight}
              initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-dark-100 border-l border-glass-border z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                   <span className="font-display font-bold text-xl text-white">Menu</span>
                   <button onClick={closeMenu} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <nav className="space-y-4">
                  <NavLink href="/dashboard">Dashboard</NavLink>
                  <NavLink href="/#features">Features</NavLink>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}



// const MainLinks = ({link})=> (
//   <>
//     <NavLink className='capitalize' href={`/#${link}`}>{link}</NavLink>
//   </>
// );



function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className={`text-gray-300 hover:text-white font-medium transition-colors ${
        Router.pathname === href ? 'active' : ''
      }`}
    >
      {children}
    </Link>

  );
}