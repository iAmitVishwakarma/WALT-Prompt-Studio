'use client';

/**
 * ============================================
 * LANDING PAGE
 * ============================================
 * 
 * Sections:
 * 1. Hero - Parallax aurora gradient, kinetic headline, CTA buttons
 * 2. Features - 3-column grid with icon cards
 * 3. Pricing - Free vs Pro comparison cards
 * 
 * Animations:
 * - Parallax background on hero
 * - Reveal-on-scroll for sections
 * - Card hover effects
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  fadeUp, 
  heroReveal, 
  revealOnScroll, 
  staggerContainer, 
  staggerItem,
  lift,
  viewportOptions 
} from '@/components/motion/variants';

export default function LandingPage() {
  // Parallax effect for hero background
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div  className="min-h-screen">
      
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section id='home' className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Parallax Aurora Background */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-200/50 to-dark-200" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-glass-border mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-2 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-2"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">Now in Public Beta</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            className="font-display text-display-lg font-bold text-white mb-6 leading-tight"
          >
            Transform Your Prompts
            <br />
            <span className="bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 bg-clip-text text-transparent">
              Into Masterpieces
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300  mx-auto mb-10"
          >
            AI-powered prompt optimization with profession-aware frameworks. 
            Save, version, and share your best prompts in the Vault.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="/dashboard"
              className="btn-clay px-8 py-4 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Optimizing Free
              <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>

            <motion.a
              href="#features"
              className="glass px-8 py-4 rounded-clay text-lg font-semibold text-white hover:bg-glass-hover transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              See How It Works
            </motion.a>
          </motion.div>
<br />
          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-8  mx-auto mt-16 pt-10 border-t border-glass-border"
          >
            <StatCard number="10K+" label="Prompts Optimized" />
            <StatCard number="95%" label="Quality Improvement" />
            <StatCard number="500+" label="Active Users" />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div> */}
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section id="features" className="relative py-24 bg-dark-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            variants={revealOnScroll}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            className="text-center mb-16"
          >
            <h2 className="font-display text-display-md font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300  mx-auto">
              Everything you need to craft perfect prompts for any AI model
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<IconBrain />}
              title="Profession-Aware Optimization"
              description="Tailored prompts for Developers, Marketers, Designers, and more. The AI understands your domain."
              gradient="from-accent-1 to-purple-600"
            />

            <FeatureCard
              icon={<IconFramework />}
              title="Style Frameworks"
              description="Choose from WALT, RACE, CCE, or Custom frameworks to structure your prompts perfectly."
              gradient="from-accent-2 to-orange-500"
            />

            <FeatureCard
              icon={<IconVault />}
              title="Prompt Vault"
              description="Save, version, tag, and share your best prompts. Never lose a great prompt again."
              gradient="from-accent-3 to-yellow-500"
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          PRICING SECTION
          ============================================ */}
      <section id="pricing" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            variants={revealOnScroll}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            className="text-center mb-16"
          >
            <h2 className="font-display text-display-md font-bold text-white mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-300  mx-auto">
              Start free, upgrade when you need more power
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Free Plan */}
            <PricingCard
              name="Free"
              price="$0"
              period="/month"
              description="Perfect for trying out WALT"
              features={[
                '50 optimizations/month',
                'All style frameworks',
                'Basic vault (10 prompts)',
                'Community support',
              ]}
              cta="Start Free"
              href="/dashboard"
              popular={false}
            />

            {/* Pro Plan */}
            <PricingCard
              name="Pro"
              price="$1"
              period="/month"
              description="For power users and teams"
              features={[
                'Unlimited optimizations',
                'All style frameworks',
                'Unlimited vault storage',
                'Version history',
                'Priority support',
                'Export to JSON/Markdown',
              ]}
              cta="Start Free Trial"
              href="/dashboard"
              popular={true}
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="relative py-24 bg-dark-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={revealOnScroll}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
          >
            <h2 className="font-display text-display-sm font-bold text-white mb-6">
              Ready to Transform Your Prompts?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of  users creating better AI prompts every day
            </p>
            <motion.a
              href="/dashboard"
              className="btn-clay px-10 py-5 text-xl inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({ number, label }) {
  return (
    <motion.div variants={staggerItem} className="text-center shadow">
      <div className="text-5xl font-bold bg-gradient-to-r from-accent-1 to-accent-2 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-sm text-center text-gray-400">{label}</div>
    </motion.div>
  );
}

// ============================================
// FEATURE CARD COMPONENT
// ============================================
function FeatureCard({ icon, title, description, gradient }) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass p-8 rounded-glass group hover:bg-glass-hover transition-all cursor-pointer"
      whileHover={{ y: -8 }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-glow-indigo transition-all`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

// ============================================
// PRICING CARD COMPONENT
// ============================================
function PricingCard({ name, price, period, description, features, cta, href, popular }) {
  return (
    <motion.div
      variants={staggerItem}
      className={`relative glass p-8 rounded-glass ${
        popular ? 'ring-2 ring-accent-1 shadow-glow-indigo' : ''
      }`}
      whileHover={{ y: -8 }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-accent-1 to-accent-2 text-white text-xs font-bold px-4 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="font-display text-2xl font-bold text-white mb-2">
        {name}
      </h3>
      <p className="text-gray-400 mb-6">{description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-5xl font-bold text-white">{price}</span>
        <span className="text-gray-400 text-lg">{period}</span>
      </div>

      {/* CTA Button */}
      <motion.a
        href={href}
        className={`block w-full text-center py-3 rounded-xl font-semibold mb-8 transition-all ${
          popular
            ? 'btn-clay'
            : 'glass hover:bg-glass-hover text-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {cta}
      </motion.a>

      {/* Features List */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <svg className="w-5 h-5 text-accent-1 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ============================================
// ICON COMPONENTS (Simple SVG Icons)
// ============================================

function IconBrain() {
  return (
    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function IconFramework() {
  return (
    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
    </svg>
  );
}

function IconVault() {
  return (
    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );
}