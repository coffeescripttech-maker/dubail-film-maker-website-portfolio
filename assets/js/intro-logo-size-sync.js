/**
 * Intro Logo Size Sync
 * Copies the exact computed width and height from .header__logo to .intro-logo-svg
 * Ensures perfect size matching during preloader animation
 * Works for both SVG images and text animations
 */

(function() {
  let syncCount = 0;
  
  function syncLogoSizes() {
    const headerLogo = document.querySelector('.header__logo');
    const introLogo = document.querySelector('.intro-logo-svg');
    
    if (!headerLogo || !introLogo) {
      return;
    }
    
    // Wait for header logo to be fully loaded and sized
    if (headerLogo.naturalWidth === 0 || headerLogo.complete === false) {
      setTimeout(syncLogoSizes, 50);
      return;
    }
    
    // Get the computed dimensions of the header logo
    const headerLogoRect = headerLogo.getBoundingClientRect();
    const computedWidth = headerLogoRect.width;
    const computedHeight = headerLogoRect.height;
    
    // Only sync if we have valid dimensions
    if (computedWidth === 0 || computedHeight === 0) {
      setTimeout(syncLogoSizes, 50);
      return;
    }
    
    // Check if intro logo is text or image
    const isTextAnimation = introLogo.tagName === 'DIV' || introLogo.classList.contains('intro-text-animation');
    
    if (isTextAnimation) {
      // For text: Set width and let height be auto (text will wrap/scale)
      // Count only visible letters (span.letter elements) or trim whitespace
      const letterSpans = introLogo.querySelectorAll('.letter');
      const textLength = letterSpans.length > 0 
        ? letterSpans.length 
        : introLogo.textContent.trim().length;
      
      // Calculate maximum width (90% of viewport to ensure full visibility with padding)
      const maxWidth = window.innerWidth * 0.99;
      
      // Use the smaller of: header logo width or max viewport width
      const targetWidth = Math.min(computedWidth, maxWidth);
      
      // Calculate font size to fit the width
      // For Monument Extended Bold, character width ratio is approximately 0.85 (more conservative)
      // Reduced from 0.7 to make text smaller and ensure it fits
      const approximateFontSize = targetWidth / (textLength * 0.87);
      
      introLogo.style.width = 'auto'; // Let text determine width
      introLogo.style.maxWidth = maxWidth + 'px';
      introLogo.style.height = 'auto';
      introLogo.style.maxHeight = 'none';
      introLogo.style.fontSize = approximateFontSize + 'px';
      
      // Get actual rendered dimensions for debugging
      const actualRect = introLogo.getBoundingClientRect();
      
      syncCount++;
      console.log('Logo size synced (TEXT) (#' + syncCount + '):', {
        targetWidth: targetWidth + 'px',
        maxWidth: maxWidth + 'px',
        fontSize: approximateFontSize.toFixed(1) + 'px',
        textLength: textLength,
        actualWidth: actualRect.width.toFixed(1) + 'px',
        actualHeight: actualRect.height.toFixed(1) + 'px',
        viewportWidth: window.innerWidth + 'px',
        overflow: actualRect.width > maxWidth ? 'YES - TEXT TOO WIDE!' : 'no'
      });
    } else {
      // For SVG/image: Set exact dimensions
      introLogo.style.width = computedWidth + 'px';
      introLogo.style.height = computedHeight + 'px';
      introLogo.style.maxWidth = 'none';
      introLogo.style.maxHeight = 'none';
      
      syncCount++;
      console.log('Logo size synced (SVG) (#' + syncCount + '):', {
        width: computedWidth + 'px',
        height: computedHeight + 'px'
      });
    }
  }
  
  // Expose globally so intro-text-animation.js can call it
  window.syncLogoSizes = syncLogoSizes;
  
  // Sync immediately
  syncLogoSizes();
  
  // Sync on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncLogoSizes);
  }
  
  // Sync after a short delay to catch any dynamic sizing
  setTimeout(syncLogoSizes, 100);
  setTimeout(syncLogoSizes, 300);
  setTimeout(syncLogoSizes, 500);
  
  // Watch for when .is-visible class is added to .intro-anim
  const introAnim = document.querySelector('.intro-anim');
  if (introAnim) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (introAnim.classList.contains('is-visible')) {
            syncLogoSizes();
          }
        }
      });
    });
    
    observer.observe(introAnim, { attributes: true });
  }
  
  // Sync on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncLogoSizes, 100);
  });
  
  // Sync when animation ends
  const blocIntro = document.querySelector('.bloc-intro');
  if (blocIntro) {
    const blocObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (blocIntro.classList.contains('lottie-ended')) {
            syncLogoSizes();
          }
        }
      });
    });
    
    blocObserver.observe(blocIntro, { attributes: true });
  }
})();
