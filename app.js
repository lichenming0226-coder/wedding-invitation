'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const scenes = ['intro', 'poemStage', 'guide'].map($);
  const slides = [...document.querySelectorAll('#photos img')];
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => $(tab.dataset.panel));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const music = $('bgMusic');
  const musicToggle = $('musicToggle');
  const siteLoader = $('siteLoader');
  const timers = new Set();
  let phase = 'intro', photoIndex = 0, panelIndex = 0;
  let paused = motion.matches, infoSelected = false, photoTimer, panelTimer, switchingPanel = false;
  let musicPreference = 'auto';
  let musicEverPlayed = false;
  let guideAssetsPromise;
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const cancel = id => { clearTimeout(id); timers.delete(id); };
  const duration = ms => motion.matches ? 0 : ms;
  const loadingStarted = window.__invitationLoadingStarted || performance.now();
  const loadingMinDuration = 1200;
  const loadingMaxDuration = 1600;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
  const waitForImage = image => {
    if (!image) return Promise.resolve();
    if (image.complete && image.naturalWidth) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  };
  async function finishLoading() {
    const criticalImages = [
      document.querySelector('.envelope-back'),
      document.querySelector('.wax-seal'),
      document.querySelector('.couple-doodle'),
    ];
    const criticalFonts = document.fonts ? Promise.allSettled([
      document.fonts.load('28px "Italianno"'),
      document.fonts.load('20px "IM Fell English"'),
      document.fonts.load('16px "ZCOOL XiaoWei"'),
      document.fonts.load('16px "Italianno Journey"'),
    ]) : Promise.resolve();
    const ready = Promise.allSettled([
      ...criticalImages.map(waitForImage),
      criticalFonts,
    ]);
    await Promise.race([
      ready,
      sleep(loadingMaxDuration - (performance.now() - loadingStarted)),
    ]);
    await sleep(loadingMinDuration - (performance.now() - loadingStarted));
    siteLoader.classList.add('is-leaving');
    document.body.classList.remove('is-loading');
    siteLoader.setAttribute('aria-hidden', 'true');
    later(() => siteLoader.remove(), 460);
  }
  finishLoading();
  const activateImage = image => {
    if (!image.src && image.dataset.src) {
      image.src = image.dataset.src;
      delete image.dataset.src;
    }
    return image;
  };
  const decodeImage = async image => {
    activateImage(image);
    try { await image.decode(); } catch { /* Keep the layout usable if a nonessential image fails. */ }
    return image;
  };
  const loadSceneImages = scene => Promise.all([...scene.querySelectorAll('img[data-src]')].map(decodeImage));
  const prepareGuideAssets = () => {
    if (!guideAssetsPromise) guideAssetsPromise = Promise.all([
      decodeImage(slides[0]),
      decodeImage(document.querySelector('.french-frame')),
    ]);
    return guideAssetsPromise;
  };
  const runWhenIdle = callback => {
    if ('requestIdleCallback' in window) requestIdleCallback(callback, { timeout: 1800 });
    else later(callback, 700);
  };

  function syncMusicButton() {
    const playing = !music.paused;
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', `${playing ? '关闭' : '播放'}背景音乐：陶喆《就是爱你》`);
  }
  async function playMusic() {
    if (musicPreference === 'off' || !music.paused) {
      syncMusicButton();
      return;
    }
    if (!music.src && music.dataset.src) {
      music.src = music.dataset.src;
      delete music.dataset.src;
      music.load();
    }
    try {
      await music.play();
      musicEverPlayed = true;
    } catch { /* Browsers may require the first user gesture. */ }
    syncMusicButton();
  }
  musicToggle.addEventListener('click', () => {
    if (music.paused) { musicPreference = 'on'; playMusic(); }
    else { musicPreference = 'off'; music.pause(); }
  });
  music.addEventListener('play', syncMusicButton);
  music.addEventListener('pause', syncMusicButton);
  const unlockEvents = ['touchstart', 'pointerdown', 'click', 'keydown'];
  const removeMusicUnlockListeners = () => {
    unlockEvents.forEach(type => document.removeEventListener(type, unlockMusic, true));
  };
  function unlockMusic(event) {
    if (musicPreference !== 'auto' || !music.paused || musicToggle.contains(event.target)) return;
    playMusic();
  }
  unlockEvents.forEach(type => document.addEventListener(type, unlockMusic, { capture: true, passive: true }));
  music.addEventListener('playing', () => {
    musicEverPlayed = true;
    removeMusicUnlockListeners();
    syncMusicButton();
  }, { once: true });
  playMusic();
  const playThroughWeixinBridge = () => {
    if (musicPreference !== 'auto' || !music.paused) return;
    if (window.WeixinJSBridge?.invoke) {
      window.WeixinJSBridge.invoke('getNetworkType', {}, playMusic);
    } else {
      playMusic();
    }
  };
  document.addEventListener('WeixinJSBridgeReady', playThroughWeixinBridge, { once: true });
  if (window.WeixinJSBridge) playThroughWeixinBridge();
  music.addEventListener('loadedmetadata', () => {
    if (musicPreference === 'auto' && music.paused) playMusic();
  }, { once: true });
  window.addEventListener('pageshow', event => {
    if (musicPreference === 'auto' && music.paused) {
      if (event.persisted && musicEverPlayed) music.currentTime = 0;
      playMusic();
    }
  });
  runWhenIdle(() => decodeImage(document.querySelector('.letter-card img')));

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
    // Each character lands directly in its own line; later letters keep falling.
    poemAnimations = poemLetters.map((letter, index) => {
      const box = letter.getBoundingClientRect();
      const drift = (index * 17 % 35) - 17;
      const angle = (index * 11 % 21) - 10;
      const animation = letter.animate([
        { offset: 0, opacity: 0, transform: `translate(${drift}px, ${-box.bottom - 30}px) rotate(${angle}deg)`, easing: 'cubic-bezier(.28,.12,.35,1)' },
        { offset: .14, opacity: 1 },
        { offset: .85, opacity: 1, transform: 'translate(0, 3px) rotate(0)', easing: 'ease-out' },
        { offset: 1, opacity: 1, transform: 'translate(0, 0) rotate(0)' }
      ], { duration: 1500, delay: index * 38, fill: 'both' });
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
      if (id === 'poemStage') {
        loadSceneImages($('poemStage'));
        prepareGuideAssets();
        animatePoem();
        $('openGuide').focus({ preventScroll: true });
      }
      if (id === 'guide') { tabs[panelIndex].focus({ preventScroll: true }); startRotation(); }
    }, duration(240));
  }
  function openEnvelope() {
    if (phase !== 'intro') return;
    if (musicPreference !== 'off' && music.paused) playMusic();
    phase = 'opening';
    $('intro').classList.add('opening');
    $('openEnvelope').disabled = true;
    $('openEnvelope').setAttribute('aria-expanded', 'true');
    $('letterCard').setAttribute('aria-hidden', 'false');
    $('envelopeHint').disabled = true;
    later(() => {
      phase = 'letter';
      $('readInvitation').hidden = false;
      $('readInvitation').focus({ preventScroll: true });
    }, duration(3800));
  }
  $('openEnvelope').addEventListener('click', openEnvelope);
  $('envelopeHint').addEventListener('click', openEnvelope);
  $('readInvitation').addEventListener('click', () => { if (phase === 'letter') showScene('poemStage'); });
  $('openGuide').addEventListener('click', async () => {
    if (phase !== 'poemStage') return;
    await prepareGuideAssets();
    if (phase === 'poemStage') showScene('guide');
  });

  async function changePhoto() {
    if (phase !== 'guide' || paused || document.hidden) return;
    const nextIndex = (photoIndex + 1) % slides.length;
    const next = slides[nextIndex];
    await decodeImage(next);
    if (phase !== 'guide' || paused || document.hidden) return;
    const old = slides[photoIndex];
    // Adjacent opaque slides move together, avoiding ghosted faces and blank frames.
    next.hidden = false;
    next.classList.add('entering');
    void next.offsetWidth;
    old.classList.remove('active');
    old.classList.add('exiting');
    next.classList.remove('entering');
    next.classList.add('active');
    photoIndex = nextIndex;
    later(() => {
      old.hidden = true;
      old.classList.remove('exiting');
      schedulePhoto();
    }, duration(950));
  }
  function schedulePhoto() { cancel(photoTimer); if (!paused && phase === 'guide' && !document.hidden) photoTimer = later(changePhoto, 2050); }
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
  const canUseServiceWorker = location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && canUseServiceWorker) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}), { once: true });
  }
})();
