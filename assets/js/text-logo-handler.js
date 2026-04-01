/**
 * Text Logo Handler
 * Ensures consistent text-based logo across all pages
 * On non-homepage pages: shows text logo in header position with correct color
 */

(function() {
  console.log('🔤 Text Logo Handler loaded');
  
  // Handle text logo on non-homepage pages
  function setupTextLogo() {
    console.log('🔍 setupTextLogo called');
    console.log('🔍 Body classes:', document.body.className);
    
    // Check if this is a non-homepage page
    const isHomepage = document.body.classList.contains('template-homepage');
    
    if (isHomepage) {
      console.log('✓ Homepage detected - text logo handled by intro animation');
      return;
    }
    
    console.log('✓ Non-homepage page detected');
    
    // Find the text logo - try both old and new selectors
    const textLogo = document.querySelector('.static-text-logo .intro-text-animation') || 
                     document.querySelector('.bloc-intro .intro-text-animation');
    const container = document.querySelector('.static-text-logo') || 
                      document.querySelector('.bloc-intro');
    
    if (!textLogo) {
      console.warn('⚠️ Text logo element not found');
      return;
    }
    
    // Log current CSS state BEFORE changes
    console.log('📊 BEFORE changes:');
    console.log('  - Text opacity:', window.getComputedStyle(textLogo).opacity);
    console.log('  - Text visibility:', window.getComputedStyle(textLogo).visibility);
    console.log('  - Text color:', window.getComputedStyle(textLogo).color);
    if (container) {
      console.log('  - Container classes:', container.className);
      console.log('  - Container position:', window.getComputedStyle(container).position);
      console.log('  - Container top:', window.getComputedStyle(container).top);
    }
    
    // Detect background and set appropriate color
    const isLightBackground = document.body.classList.contains('template-about') || 
                              document.body.classList.contains('template-contact') ||
                              document.body.classList.contains('body-light');
    const textColor = isLightBackground ? '#000000' : '#ffffff';
    
    // Update text color
    textLogo.style.color = textColor;
    console.log(`✓ Set text logo color to: ${textColor} (light bg: ${isLightBackground})`);
    
    // Hide SVG logos
    const svgLogos = document.querySelectorAll('.header__logo');
    svgLogos.forEach(logo => {
      logo.style.display = 'none';
      logo.style.opacity = '0';
      logo.style.visibility = 'hidden';
    });
    console.log('✓ SVG logos hidden');
    
    // Add intro-ended class to body immediately to show text logo
    if (!document.body.classList.contains('intro-ended')) {
      document.body.classList.add('intro-ended');
      console.log('✓ Added intro-ended class to body');
    }
    
    // Log current CSS state AFTER changes
    setTimeout(() => {
      console.log('📊 AFTER changes (50ms later):');
      console.log('  - Body classes:', document.body.className);
      console.log('  - Text opacity:', window.getComputedStyle(textLogo).opacity);
      console.log('  - Text visibility:', window.getComputedStyle(textLogo).visibility);
      console.log('  - Text color:', window.getComputedStyle(textLogo).color);
      if (container) {
        console.log('  - Container position:', window.getComputedStyle(container).position);
        console.log('  - Container top:', window.getComputedStyle(container).top);
      }
      console.log('✓ Text logo should now be visible at header position');
    }, 50);
  }
  
  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTextLogo);
  } else {
    setupTextLogo();
  }
  
  // Expose function globally for manual use
  window.setupTextLogo = setupTextLogo;
  
  // Listen for custom navigation events (for SPA navigation)
  window.addEventListener('page-loaded', function() {
    console.log('🔄 Page loaded event detected, setting up text logo...');
    setTimeout(setupTextLogo, 50);
  });
  
})();
