/**
 * TERRA — Motion Manager
 * Controls parallax motion enable/disable and respects prefers-reduced-motion
 */

let motionEnabled = true;
const listeners = [];

export function initMotionManager() {
  const motionToggle = document.getElementById('motionToggle');
  const motionLabel = document.getElementById('motionLabel');
  const mobileMotionToggle = document.getElementById('mobileMotionToggle');
  const motionIndicator = motionToggle ? motionToggle.querySelector('.motion-indicator') : null;

  // Check system setting
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    motionEnabled = false;
  }

  updateUI();

  function toggleMotion() {
    motionEnabled = !motionEnabled;
    updateUI();
    listeners.forEach((callback) => callback(motionEnabled));
  }

  function updateUI() {
    document.body.setAttribute('data-motion', motionEnabled ? 'enabled' : 'disabled');
    
    if (motionLabel) {
      motionLabel.textContent = `MOTION: ${motionEnabled ? 'ON' : 'OFF'}`;
    }
    if (motionIndicator) {
      if (motionEnabled) {
        motionIndicator.classList.add('active');
      } else {
        motionIndicator.classList.remove('active');
      }
    }
    if (mobileMotionToggle) {
      mobileMotionToggle.textContent = `Motion: ${motionEnabled ? 'ON' : 'OFF'}`;
    }
  }

  if (motionToggle) {
    motionToggle.addEventListener('click', toggleMotion);
  }
  if (mobileMotionToggle) {
    mobileMotionToggle.addEventListener('click', toggleMotion);
  }

  // Listen for system changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    motionEnabled = !e.matches;
    updateUI();
    listeners.forEach((callback) => callback(motionEnabled));
  });
}

export function isMotionEnabled() {
  return motionEnabled;
}

export function onMotionChange(callback) {
  listeners.push(callback);
}
