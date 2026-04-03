/**
 * CSS Text Animation for DUBAIFILMMAKER
 * Replaces Lottie animation with CSS-based text reveal
 */

console.log('🚀 intro-text-animation.js loaded - VERSION 2');

class IntroTextAnimation {
  constructor(wrapper, config = {}) {
    this.$introWrapper = wrapper;
    this.$intro = null;
    this.$timeline = null;
    this.animationComplete = false;
    this.animationDuration = 2000; // 2 seconds total (matching Lottie 50 frames @ 25fps)
    
    // Configuration
    this.config = {
      type: config.type || 'text', // 'text' or 'svg'
      text: config.text || 'DUBAIFILMMAKER',
      initialLetters: config.initialLetters || [0, 9, 10, 11, 12, 13], // Default: D and MAKER (indices)
      // OR use letter-based config:
      initialPattern: config.initialPattern || null, // e.g., 'DMAKER' or 'DR'
      holdDuration: config.holdDuration || 3000, // How long to show initial letters
      revealStartTime: config.revealStartTime || 3480, // When to start revealing other letters
      letterDelays: config.letterDelays || null, // Custom delays for each letter
      // SVG animation config
      logoSrc: config.logoSrc || 'assets/img/logo/dubaifilmmaker-light.svg',
      fadeInDuration: config.fadeInDuration || 1000
    };
    
    this.init();
  }

  init() {
    this.initParams();
    this.bind();
  }

  initParams() {
    // Lock scroll during intro
    if (window.c && window.c.lockScroll) {
      window.c.lockScroll.dispatch();
    }

    this.$intro = this.$introWrapper.querySelector('.intro-anim');
    this.$timeline = this.$introWrapper.querySelector('.intro-timeline');

    // Create text animation HTML
    if (this.$intro) {
      this.createTextAnimation();
    }
  }

  createTextAnimation() {
    // Check animation type
    if (this.config.type === 'svg') {
      this.createSVGAnimation();
      return;
    }
    
    // Text animation (existing code)
    // Clear existing content
    this.$intro.innerHTML = '';

    // Create wrapper container for better positioning control
    const wrapper = document.createElement('div');
    wrapper.className = 'intro-text-wrapper';

    // Create text container
    const textContainer = document.createElement('div');
    textContainer.className = 'intro-text-animation';

    // Determine which letters to show initially
    let initialIndices = this.config.initialLetters;
    if (this.config.initialPattern) {
      initialIndices = this.getIndicesFromPattern(this.config.text, this.config.initialPattern);
    }

    // Create letter spans
    this.config.text.split('').forEach((char, index) => {
      const letter = document.createElement('span');
      letter.className = initialIndices.includes(index) ? 'letter letter-initial' : 'letter';
      letter.textContent = char;
      textContainer.appendChild(letter);
    });

    wrapper.appendChild(textContainer);
    this.$intro.appendChild(wrapper);

    // Apply animation delays
    this.applyAnimationDelays(initialIndices);
  }
  
  createSVGAnimation() {
    // Clear existing content
    this.$intro.innerHTML = '';

    // Create wrapper container
    const wrapper = document.createElement('div');
    wrapper.className = 'intro-logo-wrapper';

    // Create SVG logo
    const logo = document.createElement('img');
    logo.className = 'intro-logo-svg';
    logo.src = this.config.logoSrc;
    logo.alt = 'Logo';
    
    // Get preset config from window (set by header-critical-css in index.html)
    const headerConfig = window.__headerConfig;
    const presetName = window.__headerPresetName || 'default';
    const preset = headerConfig?.presets?.[presetName];
    
    if (!preset) {
      console.error('❌ Preset not found:', presetName);
      console.log('Available presets:', headerConfig?.presets ? Object.keys(headerConfig.presets) : 'none');
    }
    
    console.log('📐 SVG Intro Logo using preset "' + presetName + '"');
    
    // Inject CSS for intro logo using same generateHeaderCSS logic
    if (preset && !document.getElementById('intro-logo-critical-css')) {
      const style = document.createElement('style');
      style.id = 'intro-logo-critical-css';
      
      let css = '';
      
      // Mobile styles
      if (preset.mobile && preset.mobile.logo) {
        css += '@media (max-width: 767px) {';
        css += '.intro-logo-svg {';
        css += 'display: block !important;';
        css += 'max-height: ' + preset.mobile.logo.maxHeight + ' !important;';
        css += 'max-width: ' + preset.mobile.logo.maxWidth + ' !important;';
        css += 'width: ' + preset.mobile.logo.width + ' !important;';
        css += 'object-fit: contain !important;';
        css += 'height: auto !important;';
        css += '}';
        css += '}';
      }
      
      // Desktop styles
      if (preset.desktop && preset.desktop.logo) {
        css += '@media (min-width: 768px) {';
        css += '.intro-logo-svg {';
        css += 'display: block !important;';
        css += 'max-height: ' + preset.desktop.logo.maxHeight + ' !important;';
        css += 'width: ' + preset.desktop.logo.width + ' !important;';
        css += 'object-fit: contain !important;';
        css += 'height: auto !important;';
        css += '}';
        css += '}';
      }
      
      // Extra large styles
      if (preset.extraLarge && preset.extraLarge.logo) {
        css += '@media (min-width: 1200px) {';
        css += '.intro-logo-svg {';
        css += 'max-height: ' + preset.extraLarge.logo.maxHeight + ' !important;';
        css += '}';
        css += '}';
      }
      
      style.textContent = css;
      document.head.appendChild(style);
      console.log('✓ Intro logo CSS injected from preset');
    }

    wrapper.appendChild(logo);
    this.$intro.appendChild(wrapper);

    // Fade in the logo
    setTimeout(() => {
      logo.style.transition = `opacity ${this.config.fadeInDuration}ms ease`;
      logo.style.opacity = '1';
    }, 100);
  }
  
  getIndicesFromPattern(text, pattern) {
    // Find where the pattern appears in the text
    const indices = [];
    let searchStart = 0;
    
    for (let char of pattern) {
      const index = text.indexOf(char, searchStart);
      if (index !== -1) {
        indices.push(index);
        searchStart = index + 1;
      }
    }
    
    return indices;
  }
  
  applyAnimationDelays(initialIndices) {
    const letters = this.$intro.querySelectorAll('.letter');
    const holdDuration = this.config.holdDuration;
    
    letters.forEach((letter, index) => {
      if (initialIndices.includes(index)) {
        // Initial letters: visible from start, animate at holdDuration
        letter.style.animationDelay = `${holdDuration}ms`;
      } else {
        // Other letters: calculate staggered delay
        const revealDelay = this.calculateRevealDelay(index, initialIndices);
        letter.style.animationDelay = `${revealDelay}ms`;
      }
    });
  }
  
  calculateRevealDelay(index, initialIndices) {
    // Custom delays if provided
    if (this.config.letterDelays && this.config.letterDelays[index]) {
      return this.config.letterDelays[index];
    }
    
    // Default: stagger based on position
    // Letters between initial letters get revealed in order
    const nonInitialIndex = index - initialIndices.filter(i => i < index).length;
    const baseDelay = this.config.revealStartTime;
    const staggerDelay = 80; // 80ms between each letter
    
    return baseDelay + (nonInitialIndex * staggerDelay);
  }

  bind() {
    // Listen for main video buffer progress
    if (window.a && window.a.mainPlayerBuffer) {
      window.a.mainPlayerBuffer.listen(this.onBuffer);
    } else {
      // Fallback: wait 2 seconds to show DMAKER before starting animation
      console.log('No video buffer found, waiting 2 seconds before starting animation');
      setTimeout(() => this.launchAnimation(), 2000);
    }
  }

  unbind() {
    if (window.a && window.a.mainPlayerBuffer) {
      window.a.mainPlayerBuffer.unlisten(this.onBuffer);
    }
  }

  onBuffer = (progress) => {
    // Update timeline
    if (this.$timeline) {
      const inner = this.$timeline.querySelector('.inner');
      if (inner) {
        inner.style.width = `${progress * 100}%`;
      }
    }

    // When buffer is complete, launch animation
    if (progress >= 1) {
      if (window.a && window.a.mainPlayerBuffer) {
        window.a.mainPlayerBuffer.unlisten(this.onBuffer);
      }
      this.launchAnimation();
    }
  };

  launchAnimation() {
    // Check if homepage
    const isHomepage = document.body.classList.contains('template-homepage');
    
    if (!isHomepage) {
      // // Non-homepage: Skip animation entirely, just mark as complete
      // // console.log('⏭️ Non-homepage - skipping animation, applying final position');
      // // this.$introWrapper.classList.add('lottie-started');
      // // this.$introWrapper.classList.add('lottie-ended');
      // this.animationComplete = true;
      
      // // Unlock scroll immediately
      // if (window.c && window.c.unlockScroll) {
      //   window.c.unlockScroll.dispatch();
      // }
      
      // // Add intro-ended class immediately (no delay needed)
      // document.body.classList.add('intro-ended');
      // console.log('✓ Text positioned at header, ready to show');
      
      // this.unbind();
      // return;
    }
    
    console.log('✓ Homepage - running full animation');
    
    // Add intro-active class to hide logo during animation
    document.body.classList.add('intro-active');
    console.log('✓ Added intro-active class - logo hidden during animation');
    
    // Add lottie-started class for background transition
    this.$introWrapper.classList.add('lottie-started');
    
    // Start the CSS animation (already defined in CSS with delays)
    this.$intro.classList.add('animating');

    // Total duration: 3000ms initial hold + 2000ms animation = 5000ms
    setTimeout(() => {
      this.onAnimationEnded();
    }, 5000);
  }

  onAnimationEnded() {
    // This only runs on homepage now
    console.log('🎯 Animation ended, fading out preloader text and showing header logo');
    
    // Remove intro-active class to show logo
    document.body.classList.remove('intro-active');
    console.log('✓ Removed intro-active class - logo now visible');
    
    const preloaderText = this.$intro.querySelector('.intro-text-animation');
    
    // Fade out the preloader text
    if (preloaderText) {
      preloaderText.style.transition = 'opacity 0.5s ease';
      preloaderText.style.opacity = '0';
      console.log('✓ Preloader text fading out');
    }
    
    // Show the header logo
    const headerLogo = document.querySelector('.header__logo');
    if (headerLogo) {
      // Make sure logo has src set
      if (!headerLogo.src || headerLogo.src.includes('undefined')) {
        const presetConfig = window.__headerPreset;
        if (presetConfig && presetConfig.logo && presetConfig.logo.src) {
          headerLogo.src = presetConfig.logo.src;
          console.log('✓ Header logo src set:', presetConfig.logo.src);
        }
      }
      
      // Add loaded class to trigger visibility
      headerLogo.classList.add('loaded');
      console.log('✓ Header logo will be visible');
    }
    
    // Add completion class - this triggers the upward movement via CSS
    this.$introWrapper.classList.add('lottie-ended');
    this.animationComplete = true;

    // Unlock scroll
    if (window.c && window.c.unlockScroll) {
      window.c.unlockScroll.dispatch();
    }

    // Dispatch custom event for other scripts
    if (window.a && window.a.introEnded) {
      window.a.introEnded.dispatch();
    }

    // After 800ms, add intro-ended class and hide intro completely
    setTimeout(() => {
      console.log('Adding intro-ended class - header logo visible, intro hidden');
      if (document.scrollingElement) {
        document.scrollingElement.classList.add('intro-ended');
      }
      document.body.classList.add('intro-ended');
      
      // Hide the entire intro wrapper after transition
      setTimeout(() => {
        this.$introWrapper.style.display = 'none';
        console.log('✓ Intro wrapper hidden completely');
      }, 500);
    }, 800);

    this.unbind();
  }

  destroy() {
    this.unbind();
  }
}

// Export for use in build.min.js or other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntroTextAnimation;
}

// Make available globally
window.IntroTextAnimation = IntroTextAnimation;
