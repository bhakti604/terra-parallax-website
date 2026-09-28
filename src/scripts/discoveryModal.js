/**
 * TERRA — Discovery Detail Modal
 * Interactive modal for Section 3 Discovery Cards (Forests, Water, Earth)
 * Includes real data, telemetry, and working JSON export
 */

const ARCHIVE_DATA = {
  forest: {
    tag: 'BIOSPHERE ARCHIVE // 01',
    title: '01 — FORESTS',
    img: '/images/forest.jpg',
    lead: 'Ancient forest ecosystems operate not as disparate trees, but as an interconnected biological superorganism bonded by mycorrhizal fungal networks.',
    paragraphs: [
      'Beneath the forest floor lies a dense subterranean grid: the wood-wide web. Mycorrhizal fungal hyphae thread through root tips, transferring carbon, nitrogen, phosphorus, and biochemical alarm signals between old-growth "mother trees" and shaded saplings.',
      'Through selective transpiration and volatile organic aerosol emissions (terpenes and pinene), primeval canopies actively modulate regional cloud cover and rainfall frequency, serving as both planetary radiator and carbon warehouse.',
      'In our design paradigm for the symbiotic future, we extract structural principles from these organic networks to build fault-tolerant, decentralized energy and computational grids.'
    ],
    telemetry: [
      { label: 'Ecosystem Classification', value: 'Primeval Temperate Conifer' },
      { label: 'Mycelial Density', value: '450 km / m³ topsoil' },
      { label: 'Global Carbon Storage', value: '861 Gigatons' },
      { label: 'Microclimate Cooling', value: '-3.8°C canopy variance' },
      { label: 'Endemic Biodiversity', value: '14,200 documented taxa' }
    ]
  },
  water: {
    tag: 'HYDROSPHERE ARCHIVE // 02',
    title: '02 — WATER',
    img: '/images/water.jpg',
    lead: 'Glacial headwaters and atmospheric rivers represent the circulatory fluid dynamics of planetary equilibrium, filtering life through volcanic mineral strata.',
    paragraphs: [
      'Water on Earth is ancient, cycling through celestial impacts, volcanic degassing, and deep crustal aquifers for over 4.4 billion years. Every raindrop falling upon alpine crags has passed through countless geological strata.',
      'Natural stream geometry is inherently fractal. Meanders, riffles, and gravel point-bars naturally oxygenate fluids and precipitate heavy minerals without requiring external power.',
      'Future civil infrastructure mimics this natural hydrodynamic metabolism: gravity-fed bio-swales and reed-bed filtration cells that turn municipal wastewater into potable mineral streams.'
    ],
    telemetry: [
      { label: 'Kinetic Flow Velocity', value: '4.2 m/s headwaters' },
      { label: 'Dissolved Minerals', value: '184 mg/L silica & magnesium' },
      { label: 'Atmospheric River Flux', value: '15x Mississippi discharge' },
      { label: 'Filtration Efficiency', value: '99.98% particulate removal' },
      { label: 'Aquifer Residence Time', value: '1,420 years' }
    ]
  },
  earth: {
    tag: 'GEOSPHERE ARCHIVE // 03',
    title: '03 — EARTH',
    img: '/images/earth.jpg',
    lead: 'Tectonic lithosphere, mineral strata, and regenerative topsoil serve as the permanent memory and chemical crucible of terrestrial biology.',
    paragraphs: [
      'The crust is a dynamic canvas formed through cycles of subduction, volcanic extrusion, and sedimentary compression. In canyon walls, millions of years of climate fluctuations and extinction events are inscribed in red sandstone and charcoal basalt.',
      'A single gram of living topsoil harbors ten billion microorganisms and miles of fungal filaments. This thin, vulnerable skin produces 95% of human sustenance and anchors terrestrial nutrient cycling.',
      'In the architecture of tomorrow, we build with bio-cements and compressed earth masonry that naturally absorb ambient humidity, store solar heat, and return harmlessly to geological dust at the end of their lifecycle.'
    ],
    telemetry: [
      { label: 'Crustal Composition', value: '46.6% Oxygen, 27.7% Silicon' },
      { label: 'Mantle Boundary Pressure', value: '136 GPa at core-mantle' },
      { label: 'Microbial Density', value: '10 Billion / gram soil' },
      { label: 'Tectonic Drift Velocity', value: '2.5 cm / annum' },
      { label: 'Thermal Geothermal Gradient', value: '25°C / km depth' }
    ]
  }
};

let currentCardKey = 'forest';

export function initDiscoveryModal() {
  const modal = document.getElementById('discoveryModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const actionBtn = document.getElementById('modalActionBtn');
  const cards = document.querySelectorAll('.discovery-card');

  if (!modal) return;

  function openModal(cardKey) {
    const data = ARCHIVE_DATA[cardKey] || ARCHIVE_DATA.forest;
    currentCardKey = cardKey;

    // Populate data
    const heroImg = document.getElementById('modalHeroImg');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalLead = document.getElementById('modalLead');
    const richText = document.getElementById('modalRichText');
    const telemetryBox = document.getElementById('modalTelemetry');

    if (heroImg) {
      heroImg.src = data.img;
      heroImg.alt = data.title;
    }
    if (modalTag) modalTag.textContent = data.tag;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalLead) modalLead.textContent = data.lead;

    if (richText) {
      richText.innerHTML = data.paragraphs
        .map((p) => `<p>${p}</p>`)
        .join('');
    }

    if (telemetryBox) {
      telemetryBox.innerHTML = data.telemetry
        .map(
          (t) => `
        <div class="telemetry-row">
          <span class="tr-label">${t.label}:</span>
          <span class="tr-value">${t.value}</span>
        </div>`
        )
        .join('');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach card triggers
  cards.forEach((card) => {
    const key = card.getAttribute('data-card');
    card.addEventListener('click', () => openModal(key));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(key);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Working JSON Export Functionality
  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      const data = ARCHIVE_DATA[currentCardKey];
      const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `terra_archive_${currentCardKey}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
}
