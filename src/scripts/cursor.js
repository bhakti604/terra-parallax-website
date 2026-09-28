/**
 * TERRA — Custom Magnetic Cursor (Desktop Fine Pointer Only)
 */

export function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // Only initialize on devices that support hover and fine pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  // Smooth lerp loop for the outer ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Attach hover detection on interactive elements
  const hoverTargets = 'a, button, [role="button"], input, select, .floating-depth-tag, .discovery-card, .feature-tab';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      if (!isHovering) {
        isHovering = true;
        document.body.classList.add('cursor-hover');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      if (isHovering) {
        isHovering = false;
        document.body.classList.remove('cursor-hover');
      }
    }
  });
}
