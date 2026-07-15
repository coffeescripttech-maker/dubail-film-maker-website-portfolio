/**
 * Intro Logo Size Sync
 * Copies the exact computed width/fontSize from .header__logo to .intro-logo-svg
 * Ensures perfect size matching during preloader animation.
 */

(function () {
  let done = false;

  function syncLogoSizes() {
    if (done) return;

    const headerLogo = document.querySelector('.header__logo');
    const introLogo = document.querySelector('.intro-logo-svg');

    if (!headerLogo || !introLogo) return;

    // Wait for image to be sized
    if (headerLogo.naturalWidth === 0 || headerLogo.complete === false) {
      setTimeout(syncLogoSizes, 50);
      return;
    }

    const headerLogoRect = headerLogo.getBoundingClientRect();
    const computedWidth = headerLogoRect.width;

    if (computedWidth === 0) {
      setTimeout(syncLogoSizes, 50);
      return;
    }

    const isTextAnimation = introLogo.tagName === 'DIV' || introLogo.classList.contains('intro-text-animation');

    if (isTextAnimation) {
      const letterSpans = introLogo.querySelectorAll('.letter');
      const textLength = letterSpans.length > 0
        ? letterSpans.length
        : introLogo.textContent.trim().length;

      const maxWidth = window.innerWidth * 0.99;
      const targetWidth = Math.min(computedWidth, maxWidth);
      const approximateFontSize = targetWidth / (textLength * 0.87);

      introLogo.style.width = 'auto';
      introLogo.style.maxWidth = maxWidth + 'px';
      introLogo.style.height = 'auto';
      introLogo.style.maxHeight = 'none';
      introLogo.style.fontSize = approximateFontSize + 'px';
    } else {
      const computedHeight = headerLogoRect.height;
      introLogo.style.width = computedWidth + 'px';
      introLogo.style.height = computedHeight + 'px';
      introLogo.style.maxWidth = 'none';
      introLogo.style.maxHeight = 'none';
    }
  }

  // Expose globally so other scripts can call it
  window.syncLogoSizes = syncLogoSizes;

  // Sync immediately + once after layout is stable
  syncLogoSizes();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncLogoSizes);
  }
  // One deferred sync to catch dynamic sizing (replaces the 3 staggered setTimeouts)
  setTimeout(syncLogoSizes, 200);

  // Watch for .is-visible class on .intro-anim
  const introAnim = document.querySelector('.intro-anim');
  if (introAnim) {
    const animObserver = new MutationObserver(function () {
      if (introAnim.classList.contains('is-visible')) syncLogoSizes();
    });
    animObserver.observe(introAnim, { attributes: true, attributeFilter: ['class'] });
  }

  // Sync on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncLogoSizes, 150);
  });

  // Watch for intro end — stop syncing once lottie-ended is added
  const blocIntro = document.querySelector('.bloc-intro');
  if (blocIntro) {
    const blocObserver = new MutationObserver(function () {
      if (blocIntro.classList.contains('lottie-ended')) {
        done = true;          // prevent any future syncs
        blocObserver.disconnect();
      }
    });
    blocObserver.observe(blocIntro, { attributes: true, attributeFilter: ['class'] });
  }
})();
