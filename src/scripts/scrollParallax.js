/**
 * TERRA — GSAP ScrollTrigger Parallax System
 * Multi-layer scrub-based movement, variable velocities, depth realism
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionEnabled, onMotionChange } from './motionManager.js';

gsap.registerPlugin(ScrollTrigger);

let scrollTriggersList = [];

export function initScrollParallax() {
  const mm = gsap.matchMedia();

  // Desktop and Tablets (> 768px)
  mm.add('(min-width: 769px)', () => {
    setupDesktopParallax();
  });

  // Mobile (<= 768px)
  mm.add('(max-width: 768px)', () => {
    setupMobileParallax();
  });

  // Listen for motion toggle
  onMotionChange((enabled) => {
    if (!enabled) {
      ScrollTrigger.getAll().forEach(t => t.disable());
    } else {
      ScrollTrigger.getAll().forEach(t => t.enable());
      ScrollTrigger.refresh();
    }
  });

  if (!isMotionEnabled()) {
    ScrollTrigger.getAll().forEach(t => t.disable());
  }
}

/**
 * Desktop High-Fidelity Parallax Scrub Timeline
 */
function setupDesktopParallax() {
  // --- Section 1: Hero Scroll Depth ---
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      invalidateOnRefresh: true,
    }
  });

  heroTl
    .to('.terracotta-sun', { y: 140, scale: 0.88, opacity: 0.5, ease: 'none' }, 0)
    .to('#heroFarMountains', { y: 90, ease: 'none' }, 0)
    .to('#heroMist', { y: 120, x: -60, ease: 'none' }, 0)
    .to('#heroMidMountains', { y: 170, ease: 'none' }, 0)
    .to('#heroForest', { y: 250, ease: 'none' }, 0)
    .to('#heroForeground', { y: 350, ease: 'none' }, 0)
    .to('.hero-title-container', { y: -90, opacity: 0.2, ease: 'none' }, 0)
    .to('.hero-bottom-grid', { y: -45, opacity: 0, ease: 'none' }, 0);

  // --- Section 2: The Layers Multi-Strata Parallax ---
  const layersTrigger = ScrollTrigger.create({
    trigger: '#layers',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    animation: gsap.timeline()
      // Far Mountain Layer (Slowest)
      .to('#strataFarMountains', { y: 140, ease: 'none' }, 0)
      // Mid Mountain SVG (Medium)
      .to('#strataMidMountains', { y: 280, ease: 'none' }, 0)
      // Clouds Drift (Floating & Translating)
      .to('#strataClouds .band-upper', { y: 220, x: 120, ease: 'none' }, 0)
      .to('#strataClouds .band-lower', { y: 340, x: -90, ease: 'none' }, 0)
      // Forest Silhouettes (Faster)
      .to('#strataForest', { y: 460, ease: 'none' }, 0)
      // Foreground Rocks & Flora (Fastest)
      .to('#strataForeground', { y: 640, ease: 'none' }, 0)
      // Floating Editorial Labels (Gentle vertical parallax float)
      .to('.depth-tag-1', { y: -35, ease: 'none' }, 0)
      .to('.depth-tag-2', { y: 45, ease: 'none' }, 0)
      .to('.depth-tag-3', { y: -45, ease: 'none' }, 0)
      .to('.depth-tag-4', { y: 55, ease: 'none' }, 0)
      // Left Editorial Column (Smooth float)
      .to('.layers-text-column', { y: -60, ease: 'none' }, 0)
  });

  // --- Section 3: Descent Into Nature (Forest Camera Zoom & Light Rays) ---
  const descentTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#descent',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.2,
    }
  });

  descentTl
    .to('#descentForestImg', { scale: 1.2, y: 80, ease: 'none' }, 0)
    .to('#descentLightRays', { opacity: 0.95, rotate: 4, ease: 'none' }, 0);

  // Discovery Cards Stagger Entrance
  gsap.fromTo('.discovery-card', 
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#discoveryCardsGrid',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // --- Section 4: The Future Landscape Parallax ---
  const futureTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#future',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  futureTl
    .to('#futureBgLayer', { y: 120, ease: 'none' }, 0)
    .to('.future-svg-overlay', { y: 70, ease: 'none' }, 0);

  // Future container entrance
  gsap.fromTo('.future-features-container',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#futureFeaturesContainer',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // --- Section 6: Closing Section Entrance ---
  gsap.fromTo('.closing-content-container > *',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.0,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#closing',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/**
 * Mobile Streamlined Parallax (Gentle displacements, zero scroll hijacking)
 */
function setupMobileParallax() {
  // Section 1 Hero Mobile Scrub (Multiple independently moving layers)
  gsap.to('.terracotta-sun', {
    y: 65,
    scale: 0.92,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  gsap.to('#heroFarMountains', {
    y: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  gsap.to('#heroMidMountains', {
    y: 75,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  gsap.to('#heroForeground', {
    y: 120,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  // Section 2 Layers Mobile (Gentle offsets)
  gsap.to('#strataMidMountains', {
    y: 100,
    ease: 'none',
    scrollTrigger: {
      trigger: '#layers',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8
    }
  });

  gsap.to('#strataForest', {
    y: 160,
    ease: 'none',
    scrollTrigger: {
      trigger: '#layers',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8
    }
  });

  // Section 3 Discovery Cards Entrance
  gsap.fromTo('.discovery-card',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#discoveryCardsGrid',
        start: 'top 90%',
      }
    }
  );
}
