/**
 * TERRA — Navigation, Scroll Progress, Mobile Drawer, Audio Ambience
 */

export function initNavigation() {
  const progressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const sections = document.querySelectorAll('section[id]');
  const footerClock = document.getElementById('footerClock');
  const btnBegin = document.getElementById('btnBeginJourney');
  const btnBack = document.getElementById('btnBackToSurface');
  const btnReview = document.getElementById('btnReviewLayers');

  // --- Scroll Progress Bar ---
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('data-nav') === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });

  // --- Smooth Scrolling for Navigation & CTA Links ---
  function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  [...navLinks, ...mobileLinks].forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      smoothScrollTo(href);
      closeMobileMenu();
    });
  });

  if (btnBegin) {
    btnBegin.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo('#layers');
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (btnReview) {
    btnReview.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo('#layers');
    });
  }

  // --- Mobile Drawer Menu ---
  function openMobileMenu() {
    if (!mobileDrawer || !menuToggle) return;
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !menuToggle) return;
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer on escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // --- Live Footer Clock & Coordinates ---
  function updateClock() {
    if (!footerClock) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    footerClock.textContent = `${hours}:${mins}:${secs} UTC`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Subtle Ambient Sound Synthesizer (Web Audio API) ---
  initAudioAmbience();
}

/**
 * Procedural Nature Ambience via Web Audio API (Wind, resonance, organic warmth)
 * Completely self-contained, no external audio files required.
 */
function initAudioAmbience() {
  const audioToggle = document.getElementById('audioToggle');
  const audioLabel = document.getElementById('audioLabel');
  const mobileAudioToggle = document.getElementById('mobileAudioToggle');
  const audioIndicator = audioToggle ? audioToggle.querySelector('.audio-indicator') : null;

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let oscillators = [];
  let noiseNode = null;

  function createAmbience() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm Earth Drones (Root harmonics in D minor / modal: 73.4Hz, 110Hz, 146.8Hz)
    const freqs = [73.42, 110.0, 146.83, 220.0];
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Lowpass filter to ensure silky, warm, non-harsh tone
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.045 / (idx + 1), audioCtx.currentTime);

      // Subtle LFO for gentle wind swell
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      lfo.connect(oscGain.gain);
      lfo.start();

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    // Subtle filtered pink-noise wind layer
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.08;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.018, audioCtx.currentTime);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseNode.start();
  }

  function toggleAudio() {
    if (!isPlaying) {
      if (!audioCtx) {
        createAmbience();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.65, audioCtx.currentTime + 2.5);
      isPlaying = true;
    } else {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      isPlaying = false;
    }
    updateAudioUI();
  }

  function updateAudioUI() {
    if (audioLabel) {
      audioLabel.textContent = `AUDIO: ${isPlaying ? 'ON' : 'OFF'}`;
    }
    if (audioIndicator) {
      if (isPlaying) {
        audioIndicator.classList.add('active');
      } else {
        audioIndicator.classList.remove('active');
      }
    }
    if (mobileAudioToggle) {
      mobileAudioToggle.textContent = `Ambience: ${isPlaying ? 'ON' : 'OFF'}`;
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', toggleAudio);
  }
  if (mobileAudioToggle) {
    mobileAudioToggle.addEventListener('click', toggleAudio);
  }
}
