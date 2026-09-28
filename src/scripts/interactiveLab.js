/**
 * TERRA — Section 5: Interactive Parallax Laboratory
 * Multi-depth interactive stage, 3D pointer parallax, touch support,
 * Depth multiplier, atmospheric theme switcher, biome scanner lens,
 * and cinematic sweep trigger.
 */
import { gsap } from 'gsap';
import { isMotionEnabled } from './motionManager.js';

export function initInteractiveLab() {
  const stage = document.getElementById('labStage');
  const layers = stage ? stage.querySelectorAll('.lab-stage-layer') : [];
  const biomeLens = document.getElementById('biomeLens');
  const lensCoords = document.getElementById('lensCoords');
  const lensStratum = document.getElementById('lensStratum');
  const themeButtons = document.querySelectorAll('[data-theme]');
  const depthButtons = document.querySelectorAll('[data-depth-mult]');
  const btnExplore = document.getElementById('btnExploreLandscape');

  if (!stage) return;

  let depthMultiplier = 1.0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isPointerOver = false;

  // --- 1. Atmospheric Illumination Themes ---
  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      themeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update stage theme classes
      stage.classList.remove('theme-sunset', 'theme-dawn', 'theme-meridian', 'theme-charcoal');
      stage.classList.add(`theme-${theme}`);
    });
  });

  // Default theme
  stage.classList.add('theme-sunset');

  // --- 2. Depth Intensity Multipliers ---
  depthButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      depthMultiplier = parseFloat(btn.getAttribute('data-depth-mult')) || 1.0;
      depthButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // --- 3. Pointer & Touch Movement Parallax ---
  function updatePointerPosition(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const xInStage = clientX - rect.left;
    const yInStage = clientY - rect.top;

    // Relative -1 to 1 coordinates from stage center
    targetX = ((xInStage / rect.width) - 0.5) * 2;
    targetY = ((yInStage / rect.height) - 0.5) * 2;

    // Clamp
    targetX = Math.max(-1, Math.min(1, targetX));
    targetY = Math.max(-1, Math.min(1, targetY));

    // Update Biome Focus Scanner Reticle Position
    if (biomeLens) {
      biomeLens.style.left = `${xInStage}px`;
      biomeLens.style.top = `${yInStage}px`;
    }

    // Update Telemetry Display
    if (lensCoords) {
      lensCoords.textContent = `X: ${targetX.toFixed(2)} | Y: ${targetY.toFixed(2)}`;
    }

    if (lensStratum) {
      // Stratum based on vertical position
      if (yInStage < rect.height * 0.3) {
        lensStratum.textContent = 'STRATUM: UPPER CANOPY';
        lensStratum.style.color = '#C6E75A';
      } else if (yInStage < rect.height * 0.65) {
        lensStratum.textContent = 'STRATUM: MONTANE FORESTRY';
        lensStratum.style.color = '#8A9B72';
      } else {
        lensStratum.textContent = 'STRATUM: SUBTERRANEAN ROCK';
        lensStratum.style.color = '#D85B32';
      }
    }
  }

  // Mouse listeners
  stage.addEventListener('mouseenter', () => { isPointerOver = true; });
  stage.addEventListener('mouseleave', () => {
    isPointerOver = false;
    targetX = 0;
    targetY = 0;
  });

  stage.addEventListener('mousemove', (e) => {
    isPointerOver = true;
    updatePointerPosition(e.clientX, e.clientY);
  });

  // Touch listeners for mobile & tablets
  stage.addEventListener('touchstart', (e) => {
    isPointerOver = true;
    if (e.touches.length > 0) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    isPointerOver = false;
    targetX = 0;
    targetY = 0;
  });

  // Animation render loop
  function renderLab() {
    if (isMotionEnabled() && (isPointerOver || Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001)) {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-layer-depth')) || 0.5;
        const moveX = currentX * depth * 35 * depthMultiplier;
        const moveY = currentY * depth * 25 * depthMultiplier;
        const rotateY = currentX * 4 * depthMultiplier;
        const rotateX = -currentY * 3 * depthMultiplier;

        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    }

    requestAnimationFrame(renderLab);
  }
  requestAnimationFrame(renderLab);

  // --- 4. "EXPLORE THE LANDSCAPE" Cinematic Camera Sweep ---
  if (btnExplore) {
    let isExploring = false;
    btnExplore.addEventListener('click', () => {
      if (isExploring) return;
      isExploring = true;
      btnExplore.disabled = true;

      // Animate camera sweep across all layers using GSAP
      const sweepTl = gsap.timeline({
        onComplete: () => {
          isExploring = false;
          btnExplore.disabled = false;
        }
      });

      sweepTl
        // Initial zoom into stage
        .to(stage, {
          scale: 1.03,
          duration: 0.6,
          ease: 'power2.out'
        })
        // Dramatic sweep left to right with depth parallax
        .to('.lab-layer-far-ridge', { x: -60, duration: 1.2, ease: 'sine.inOut' }, 0)
        .to('.lab-layer-architecture', { x: 80, duration: 1.2, ease: 'sine.inOut' }, 0)
        .to('.lab-layer-forest', { x: -120, duration: 1.2, ease: 'sine.inOut' }, 0)
        .to('.lab-layer-foreground', { x: 140, duration: 1.2, ease: 'sine.inOut' }, 0)
        .to('#labSunDisc', { scale: 1.35, y: -20, duration: 1.2, ease: 'sine.inOut' }, 0)
        // Sweep back to equilibrium
        .to('.lab-layer-far-ridge, .lab-layer-architecture, .lab-layer-forest, .lab-layer-foreground', {
          x: 0,
          duration: 1.0,
          ease: 'elastic.out(1, 0.75)'
        })
        .to('#labSunDisc', {
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: 'elastic.out(1, 0.75)'
        }, '-=0.8')
        .to(stage, {
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.8');
    });
  }
}
