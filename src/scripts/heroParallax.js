/**
 * TERRA — Hero Parallax & GSAP Load Entrance Timeline
 */
import { gsap } from 'gsap';
import { isMotionEnabled } from './motionManager.js';

export function initHeroParallax() {
  const heroStage = document.getElementById('heroParallaxStage');
  const heroSection = document.getElementById('hero');
  const layers = heroStage ? heroStage.querySelectorAll('.hero-layer') : [];
  
  if (!heroStage || !heroSection) return;

  // --- 1. GSAP Entrance Timeline on Page Load ---
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.site-header', 
    { y: -80, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.2 }
  )
  .fromTo('.editorial-meta-box, .hero-altitude-badge',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 },
    '-=0.8'
  )
  .fromTo('.terracotta-sun',
    { scale: 0.6, y: 100, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 1.8, ease: 'expo.out' },
    '-=1.2'
  )
  .fromTo('.char-span',
    { y: 120, opacity: 0, rotateZ: 4 },
    { y: 0, opacity: 1, rotateZ: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out' },
    '-=1.2'
  )
  .fromTo('#heroFarMountains, #heroMidMountains, #heroForest, #heroForeground',
    { y: 80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: 'power2.out' },
    '-=1.0'
  )
  .fromTo('.hero-subtext-block, .hero-cta-cluster, #heroScrollIndicator',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, stagger: 0.2 },
    '-=0.8'
  );

  // --- 2. Mouse-Responsive Depth Parallax in Hero ---
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isMouseOver = false;

  const handleMouseMove = (e) => {
    if (!isMotionEnabled()) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Normalized coordinates (-1 to 1)
    targetX = (clientX - centerX) / centerX;
    targetY = (clientY - centerY) / centerY;
  };

  heroSection.addEventListener('mouseenter', () => { isMouseOver = true; });
  heroSection.addEventListener('mouseleave', () => {
    isMouseOver = false;
    targetX = 0;
    targetY = 0;
  });
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Animation Loop with smooth lerp
  function updateParallax() {
    if (isMotionEnabled() && (isMouseOver || Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001)) {
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
        const moveX = currentX * depth * 45; // Max 45px displacement
        const moveY = currentY * depth * 35; // Max 35px displacement
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    }

    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}
