/**
 * TERRA — Nature Floating Spores & Leaf Particles (Section 3)
 * Lightweight canvas particle system with organic wind dynamics
 */
import { isMotionEnabled } from './motionManager.js';

export function initNatureParticles() {
  const canvas = document.getElementById('natureParticlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let width = 0;
  let height = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Colors strictly adhering to palette
  const colors = [
    'rgba(138, 155, 114, 0.45)', // Sage
    'rgba(216, 91, 50, 0.4)',   // Terracotta
    'rgba(242, 233, 216, 0.35)', // Cream
    'rgba(198, 231, 90, 0.35)'   // Lime
  ];

  const particlesCount = 38;
  const particles = [];

  for (let i = 0; i < particlesCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.2) * 0.4,
      vy: Math.random() * 0.4 + 0.15,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      oscSpeed: Math.random() * 0.02 + 0.01,
      oscAmplitude: Math.random() * 0.6 + 0.2
    });
  }

  let time = 0;

  function renderParticles() {
    if (!isMotionEnabled()) {
      animationFrameId = requestAnimationFrame(renderParticles);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    time += 0.015;

    particles.forEach((p) => {
      // Gentle horizontal wave draft
      p.x += p.vx + Math.sin(time * p.oscSpeed + p.y * 0.01) * p.oscAmplitude;
      p.y += p.vy;
      p.angle += p.spin;

      // Wrap edges
      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      if (p.x > width) p.x = -10;
      if (p.x < -10) p.x = width;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      // Draw subtle organic seed/oval
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(renderParticles);
  }

  animationFrameId = requestAnimationFrame(renderParticles);
}
