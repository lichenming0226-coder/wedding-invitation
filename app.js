'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const scenes = ['intro', 'poemStage', 'guide'].map($);
  const slides = [...document.querySelectorAll('#photos img')];
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => $(tab.dataset.panel));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = new Set();
  let phase = 'intro', photoIndex = 0, panelIndex = 0;
  let paused = motion.matches, infoSelected = false, photoTimer, panelTimer, switchingPanel = false;
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const cancel = id => { clearTimeout(id); timers.delete(id); };
  const duration = ms => motion.matches ? 0 : ms;

  const poemLetters = [];
  document.querySelectorAll('.poem p').forEach(line => {
    const words = line.textContent;
    line.setAttribute('aria-label', words);
    line.textContent = '';
    [...words].forEach(character => {
      const letter = document.createElement('span');
      letter.className = 'poem-letter';
      letter.textContent = character;
      letter.setAttribute('aria-hidden', 'true');
      line.append(letter);
      if (character.trim()) poemLetters.push(letter);
    });
  });
  let poemAnimations = [];
  async function animatePoem() {
    poemAnimations.forEach(animation => animation.cancel());
    poemAnimations = [];
    if (motion.matches) return;
    $('poemStage').classList.add('poem-preparing');
    await document.fonts.ready;
    if (phase !== 'poemStage' || motion.matches) {
      $('poemStage').classList.remove('poem-preparing');
      return;
    }
    const bounds = document.querySelector('.poem').getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height * .65;
    poemAnimations = poemLetters.map((letter, index) => {
      const box = letter.getBoundingClientRect();
      const x = centerX + (index * 43 % 156) - 78 - (box.left + box.width / 2);
      const y = centerY + (index * 19 % 58) - 29 - (box.top + box.height / 2);
      const angle = (index * 13 % 43) - 21;
      const pile = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
      const animation = letter.animate([
        { offset: 0, opacity: 0, transform: `translate(${x - 20}px, ${-box.bottom - 80}px) rotate(${angle - 28}deg)`, easing: 'cubic-bezier(.4,0,.78,.55)' },
        { offset: .08, opacity: 1 },
        { offset: .3, opacity: 1, transform: pile, easing: 'ease-out' },
        { offset: .36, opacity: 1, transform: `translate(${x}px, ${y + 4}px) rotate(${angle + 3}deg)` },
        { offset: .52, opacity: 1, transform: pile, easing: 'cubic-bezier(.22,.68,.24,1)' },
        { offset: 1, opacity: 1, transform: 'translate(0, 0) rotate(0)' }
      ], { duration: 5000, delay: (index % 7) * 55 + Math.floor(index / 7) * 12, fill: 'both' });
      animation.id = `poem-letter-${index}`;
      return animation;
    });
    $('poemStage').classList.remove('poem-preparing');
  }

  function showScene(id) {
    const current = scenes.find(scene => !scene.hidden);
    phase = 'transition';
    current.classList.add('leaving');
    later(() => {
      scenes.forEach(scene => { scene.hidden = scene.id !== id; scene.inert = scene.hidden; scene.classList.remove('leaving', 'arriving'); });
      $(id).classList.add('arriving');
      phase = id;
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (id === 'poemStage') { animatePoem(); $('openGuide').focus({ preventScroll: true }); }
      if (id === 'guide') { tabs[panelIndex].focus({ preventScroll: true }); startRotation(); }
    }, duration(240));
  }
  $('openEnvelope').addEventListener('click', () => {
    if (phase !== 'intro') return;
    phase = 'opening';
    $('intro').classList.add('opening');
    $('openEnvelope').disabled = true;
    $('openEnvelope').setAttribute('aria-expanded', 'true');
    $('letterCard').setAttribute('aria-hidden', 'false');
    $('envelopeHint').textContent = '';
    later(() => {
      phase = 'letter';
      $('readInvitation').hidden = false;
      $('readInvitation').focus({ preventScroll: true });
    }, duration(3600));
  });
  $('readInvitation').addEventListener('click', () => { if (phase === 'letter') showScene('poemStage'); });
  $('openGuide').addEventListener('click', () => { if (phase === 'poemStage') showScene('guide'); });

  async function changePhoto() {
    if (phase !== 'guide' || paused || document.hidden) return;
    const nextIndex = (photoIndex + 1) % slides.length;
    const next = slides[nextIndex];
    try { await next.decode(); } catch { schedulePhoto(); return; }
    if (phase !== 'guide' || paused || document.hidden) return;
    const old = slides[photoIndex];
    old.classList.remove('active');
    later(() => {
      old.hidden = true;
      next.hidden = false;
      photoIndex = nextIndex;
      void next.offsetWidth;
      next.classList.add('active');
      schedulePhoto();
    }, duration(310));
  }
  function schedulePhoto() { cancel(photoTimer); if (!paused && phase === 'guide' && !document.hidden) photoTimer = later(changePhoto, 4200); }
  function schedulePanel() { cancel(panelTimer); if (!paused && !infoSelected && phase === 'guide' && !document.hidden) panelTimer = later(() => changePanel((panelIndex + 1) % panels.length), 7000); }
  function changePanel(index, manual = false) {
    if (manual) { infoSelected = true; cancel(panelTimer); }
    if (switchingPanel || index === panelIndex) return;
    cancel(panelTimer);
    switchingPanel = true;
    panels[panelIndex].classList.add('leaving');
    later(() => {
      panels.forEach((panel, n) => { panel.hidden = n !== index; panel.classList.remove('leaving', 'arriving'); });
      tabs.forEach((tab, n) => { tab.setAttribute('aria-selected', String(n === index)); tab.tabIndex = n === index ? 0 : -1; });
      panelIndex = index;
      panels[index].classList.add('arriving');
      switchingPanel = false;
      schedulePanel();
    }, duration(190));
  }
  function startRotation() { schedulePhoto(); schedulePanel(); }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => changePanel(index, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); tabs[next].focus(); changePanel(next, true); }
    });
  });
  document.addEventListener('visibilitychange', () => { cancel(photoTimer); cancel(panelTimer); if (!document.hidden && phase === 'guide') startRotation(); });
  motion.addEventListener('change', () => { paused = motion.matches; if (paused) { cancel(photoTimer); cancel(panelTimer); poemAnimations.forEach(animation => animation.cancel()); $('poemStage').classList.remove('poem-preparing'); } else if (phase === 'guide') startRotation(); });
})();
