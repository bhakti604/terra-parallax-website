/**
 * ==========================================================================
 * TERRA — BEYOND THE SURFACE
 * Interactive Parallax Scrolling Experience | Core Orchestrator
 * ==========================================================================
 */

import './style.css';
import { initMotionManager } from './scripts/motionManager.js';
import { initCursor } from './scripts/cursor.js';
import { initNavigation } from './scripts/navigation.js';
import { initHeroParallax } from './scripts/heroParallax.js';
import { initScrollParallax } from './scripts/scrollParallax.js';
import { initDiscoveryModal } from './scripts/discoveryModal.js';
import { initFutureFeatures } from './scripts/futureFeatures.js';
import { initInteractiveLab } from './scripts/interactiveLab.js';
import { initNatureParticles } from './scripts/natureParticles.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility & Motion Preference Manager
  initMotionManager();

  // 2. Custom Magnetic Cursor (Desktop)
  initCursor();

  // 3. Navigation, Progress Bar, Ambience Synthesizer & Local Clock
  initNavigation();

  // 4. Hero Section Entrance & Pointer Tilt Parallax
  initHeroParallax();

  // 5. Section 2 & Scroll-based Depth Parallax (GSAP ScrollTrigger)
  initScrollParallax();

  // 6. Section 3: Descent Nature Particles & Interactive Discovery Modal
  initNatureParticles();
  initDiscoveryModal();

  // 7. Section 4: Future Landscape Interactive Features & Simulations
  initFutureFeatures();

  // 8. Section 5: Interactive Parallax Lab & 3D Depth Viewport
  initInteractiveLab();

  console.log(
    '%c TERRA — BEYOND THE SURFACE %c Vol. 01 Initialized ',
    'background: #D85B32; color: #F2E9D8; font-weight: bold; padding: 4px 8px; border-radius: 2px;',
    'background: #171914; color: #C6E75A; font-weight: bold; padding: 4px 8px; border-radius: 2px;'
  );
});
