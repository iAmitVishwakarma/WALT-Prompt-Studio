/**
 * ============================================
 * FRAMER MOTION ANIMATION VARIANTS
 * ============================================
 * 
 * Reusable animation presets for consistent motion design.
 * Import and use with Framer Motion components.
 * 
 * Usage:
 * import { fadeUp, cardHover } from '@/components/motion/variants';
 * 
 * <motion.div variants={fadeUp} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */

// ============================================
// FADE & SLIDE ANIMATIONS
// ============================================

/**
 * Fade up from bottom (reveal on scroll)
 */
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1], // Custom easing (ease-smooth)
    },
  },
};

/**
 * Fade up with delay (for staggered reveals)
 */
export const fadeUpDelay = (delay = 0) => ({
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

/**
 * Fade in (no movement)
 */
export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide in from right (for mobile menus)
 */
export const slideInRight = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Slide in from left
 */
export const slideInLeft = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// ============================================
// SCALE & LIFT ANIMATIONS
// ============================================

/**
 * Lift effect (for cards on hover)
 */
export const lift = {
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1], // Bounce-soft easing
    },
  },
};

/**
 * Card hover with glow (for Vault cards)
 */
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 8px 30px rgba(79, 70, 229, 0.3)',
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

/**
 * Scale in (pop effect)
 */
export const scaleIn = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// ============================================
// MAGNETIC BUTTON HOVER
// ============================================

/**
 * Magnetic hover effect (button moves toward cursor)
 * Note: Requires custom hook or mouse tracking logic
 */
export const magneticButton = {
  rest: {
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// ============================================
// STAGGER CONTAINERS
// ============================================

/**
 * Stagger children animations (for lists)
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger item (child element)
 */
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ============================================
// SCROLL REVEAL VARIANTS
// ============================================

/**
 * Reveal on scroll (use with whileInView)
 */
export const revealOnScroll = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Reveal with scale (for hero elements)
 */
export const heroReveal = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// ============================================
// MODAL & OVERLAY ANIMATIONS
// ============================================

/**
 * Modal backdrop fade
 */
export const backdropFade = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Modal content slide up
 */
export const modalSlideUp = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// ============================================
// TEXT ANIMATIONS
// ============================================

/**
 * Text reveal (split text animation)
 * Use with framer-motion's motion.span for each character
 */
export const textReveal = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03, // Stagger delay per character
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

/**
 * Typewriter cursor blink
 */
export const cursorBlink = {
  blink: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create custom fade with direction
 * @param {string} direction - 'up', 'down', 'left', 'right'
 * @param {number} distance - Distance in pixels
 */
export const createFade = (direction = 'up', distance = 40) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

/**
 * Viewport options for whileInView
 */
export const viewportOptions = {
  once: true,        // Animate only once
  margin: '-100px',  // Trigger 100px before element enters viewport
  amount: 0.3,       // Trigger when 30% of element is visible
};