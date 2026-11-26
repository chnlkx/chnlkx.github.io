const solarScene = document.querySelector('.solar-scene');

if (solarScene) {
  let touchStart = null;
  let dragged = false;

  function sweepFog(event) {
    const bounds = solarScene.getBoundingClientRect();
    solarScene.style.setProperty('--fog-x', `${event.clientX - bounds.left}px`);
    solarScene.style.setProperty('--fog-y', `${event.clientY - bounds.top}px`);
    solarScene.classList.add('is-sweeping');
  }

  function endSweep() {
    touchStart = null;
    solarScene.classList.remove('is-sweeping');
  }

  solarScene.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary) return;
    dragged = false;
    if (event.pointerType === 'mouse') return;

    touchStart = { x: event.clientX, y: event.clientY };
    solarScene.setPointerCapture(event.pointerId);
    sweepFog(event);
  });

  solarScene.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') sweepFog(event);
  });

  solarScene.addEventListener('pointermove', (event) => {
    if (!event.isPrimary || (event.pointerType !== 'mouse' && !touchStart)) return;
    if (touchStart) {
      const distance = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
      if (distance > 6) dragged = true;
    }
    sweepFog(event);
  });

  solarScene.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') endSweep();
  });
  solarScene.addEventListener('pointercancel', endSweep);
  solarScene.addEventListener('lostpointercapture', endSweep);

  solarScene.addEventListener('click', (event) => {
    if (event.detail > 0 && dragged) return;
    const wasClear = solarScene.getAttribute('aria-pressed') === 'true';
    solarScene.setAttribute('aria-pressed', String(!wasClear));
  });

  solarScene.disabled = false;
  document.querySelector('.solar-instruction').hidden = false;
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.remove('reveal-pending');
      reveal.unobserve(target);
    });
  }, { rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll('.current, .section, .studio').forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight) return;
    section.classList.add('reveal-ready', 'reveal-pending');
    reveal.observe(section);
  });
}
