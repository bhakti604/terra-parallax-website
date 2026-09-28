/**
 * TERRA — Section 4: Future Landscape Interactive Features
 * Tab navigation, live computational models for clean power, urban canopy, and circular metabolic loops
 */

export function initFutureFeatures() {
  const tabs = document.querySelectorAll('.feature-tab');
  const panels = document.querySelectorAll('.feature-panel');

  // --- 1. Tab Switching ---
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetFeature = tab.getAttribute('data-feature');

      // Update tabs state
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels state
      panels.forEach((p) => {
        const pId = p.getAttribute('id');
        if (pId === `panel${capitalize(targetFeature)}`) {
          p.classList.add('active');
          p.removeAttribute('hidden');
        } else {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        }
      });
    });
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // --- 2. Interactive Widget 1: Wind Velocity & Clean Power Generation ---
  const energySlider = document.getElementById('energySlider');
  const windSpeedVal = document.getElementById('windSpeedVal');
  const powerOutputVal = document.getElementById('powerOutputVal');
  const meterFill = document.querySelector('.meter-bar-fill');
  const turbineRotors = document.querySelectorAll('.turbine-rotor');

  if (energySlider) {
    energySlider.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      if (windSpeedVal) windSpeedVal.textContent = `${v} m/s`;

      // Power cubic relation: P = k * v^3
      const baseKw = 1.6;
      const totalKw = Math.round(baseKw * Math.pow(v, 2.9));
      if (powerOutputVal) {
        powerOutputVal.textContent = `${totalKw.toLocaleString()} kW`;
      }

      // Update meter fill %
      const pct = Math.min(100, Math.round((v / 25) * 100));
      if (meterFill) {
        meterFill.style.width = `${pct}%`;
      }

      // Adjust CSS rotor spin speeds in real time
      const dur = Math.max(1.2, 12 / (v / 6));
      turbineRotors.forEach((rotor) => {
        rotor.style.animationDuration = `${dur}s`;
      });
    });
  }

  // --- 3. Interactive Widget 2: Urban Canopy Biomass & Carbon Sink ---
  const canopySlider = document.getElementById('canopySlider');
  const canopyVal = document.getElementById('canopyVal');
  const co2Val = document.getElementById('co2Val');
  const ringNumber = document.querySelector('.ring-number');

  if (canopySlider) {
    canopySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (canopyVal) canopyVal.textContent = `${val}%`;
      if (ringNumber) ringNumber.textContent = `${val}%`;

      // Estimate CO2 uptake based on biomass coverage
      const co2Tons = Math.round(val * 2.46);
      if (co2Val) co2Val.textContent = `${co2Tons} t/yr`;
    });
  }

  // --- 4. Interactive Widget 3: Circular Metabolic Cycle Pulse ---
  const btnCycle = document.getElementById('btnSimulateCycle');
  const cycleStatus = document.getElementById('cycleStatus');
  const cyclePills = document.querySelectorAll('.cycle-pill');

  if (btnCycle) {
    let isCycling = false;
    btnCycle.addEventListener('click', () => {
      if (isCycling) return;
      isCycling = true;
      btnCycle.disabled = true;

      const states = [
        'Phase 1: Hydrological Inflow & Bio-Swale Filtration',
        'Phase 2: Anaerobic Digestion & Methane Capture',
        'Phase 3: Thermal Micro-Cogeneration Peak',
        'Status: Optimal Closed-Loop Equilibrium'
      ];

      let step = 0;
      cycleStatus.textContent = states[0];
      cycleStatus.style.color = '#C6E75A';

      const interval = setInterval(() => {
        step++;
        if (step < states.length) {
          cycleStatus.textContent = states[step];
          cyclePills.forEach((p, idx) => {
            if (idx === (step - 1) % cyclePills.length) {
              p.style.backgroundColor = 'rgba(198, 231, 90, 0.25)';
              p.style.borderColor = '#C6E75A';
            } else {
              p.style.backgroundColor = '';
              p.style.borderColor = '';
            }
          });
        } else {
          clearInterval(interval);
          isCycling = false;
          btnCycle.disabled = false;
          cyclePills.forEach((p) => {
            p.style.backgroundColor = '';
            p.style.borderColor = '';
          });
        }
      }, 700);
    });
  }
}
