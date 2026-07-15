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
    this.animationStarted = false; // Prevent multiple animation starts
    this.animationDuration = 2200; // 2.2s total — Cinematic Bloom & Glow (1.4s + 0.05s×14 stagger)
    
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
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not loaded! Falling back to CSS animation');
    return;
  }

  const letters = this.$intro.querySelectorAll('.letter');

  // ─── CINEMATIC BLOOM & GLOW ────────────────────────────────────────────
  // Each letter begins oversized, blurred, and over-bright (like a lens bloom),
  // then resolves sharply into its final position with a staggered power3.out ease.
  // Total duration: 1.4s per letter + 0.05s × 13 stagger ≈ 2.05s
  // ────────────────────────────────────────────────────────────────────────

  // Initial state – bloom/glow state
  gsap.set(letters, {
    opacity: 0,
    filter: 'blur(30px) brightness(5)',
    scale: 1.3,
    transformOrigin: 'center center'
  });

  // Create GSAP timeline
  const tl = gsap.timeline({
    onComplete: () => {
      console.log('✓ GSAP animation complete — Cinematic Bloom & Glow!');
    }
  });

  // All letters resolve from bloom → sharp simultaneously, staggered
  tl.to(letters, {
    opacity: 1,
    filter: 'blur(0px) brightness(1)',
    scale: 1,
    duration: 1.4,
    stagger: 0.05,
    ease: 'power3.out',
    onStart: () => console.log('→ Cinematic Bloom & Glow resolving…')
  }, 0);

  // Store timeline for external control
  this.animationTimeline = tl;

  console.log('✓ GSAP timeline created — Cinematic Bloom & Glow (animation 81)');

  return tl;
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
      // Wait for video to be ready before starting animation (like Posterco)
      console.log('Waiting for video to be ready before starting intro animation...');
      this.waitForVideoReady();
    }
  }
  
  waitForVideoReady() {
    const checkVideo = () => {
      const video = window.__preloadVideo || document.getElementById('preload-video');
      
      if (!video) {
        console.log('⏳ Video element not created yet, checking again in 100ms...');
        setTimeout(checkVideo, 100);
        return;
      }
      
      // CRITICAL: Dynamic buffer calculation based on video duration
      // This works for ANY video length - short or long
      const duration = video.duration || 0;
      
      // Calculate minimum buffer needed dynamically:
      // We need enough buffer to cover the intro animation (5 seconds)
      // But be realistic - don't wait for too much or user waits forever
      let minBufferNeeded;
      if (duration > 0) {
        // For any video, we need at least 5 seconds (intro duration)
        // But cap at 50% of video length to avoid waiting too long
        minBufferNeeded = Math.min(5, duration * 0.5);
      } else {
        minBufferNeeded = 3; // Default fallback if duration unknown
      }
      
      // Check if buffer starts at 0 and is continuous (no gaps)
      let continuousBuffer = 0;
      if (video.buffered.length > 0) {
        // Check if buffer starts at or near 0 (within 100ms)
        if (video.buffered.start(0) < 0.1) {
          continuousBuffer = video.buffered.end(0);
        }
      }
      
      // Check if video has enough CONTINUOUS data from start
      // readyState 4 (HAVE_ENOUGH_DATA) means browser thinks it can play through without stalling
      // This is what Posterco waits for
      if (video.readyState >= 4 && continuousBuffer >= minBufferNeeded) {
        const bufferPercent = duration > 0 ? ((continuousBuffer / duration) * 100).toFixed(1) : 0;
        console.log('✅ Video ready! Starting intro animation');
        console.log('   Duration:', duration.toFixed(1) + 's');
        console.log('   ReadyState:', video.readyState, '(HAVE_ENOUGH_DATA)');
        console.log('   Continuous buffer:', continuousBuffer.toFixed(1) + 's (' + bufferPercent + '%)');
        console.log('   Required buffer:', minBufferNeeded.toFixed(1) + 's');
        this.animationStarted = true;
        this.launchAnimation();
      } else {
        const bufferPercent = duration > 0 ? ((continuousBuffer / duration) * 100).toFixed(1) : 0;
        console.log('⏳ Video not ready yet - waiting for HAVE_ENOUGH_DATA');
        console.log('   Duration:', duration > 0 ? duration.toFixed(1) + 's' : 'unknown');
        console.log('   ReadyState:', video.readyState, '(need 4 for HAVE_ENOUGH_DATA)');
        console.log('   Continuous buffer:', continuousBuffer.toFixed(1) + 's (' + bufferPercent + '%)');
        console.log('   Required buffer:', minBufferNeeded.toFixed(1) + 's');
        
        // Listen for when video becomes ready
        const onReady = () => {
          // Prevent multiple calls
          if (this.animationStarted) {
            return;
          }
          
          // Recalculate in case duration changed
          const currentDuration = video.duration || 0;
          let currentMinBuffer;
          if (currentDuration > 0) {
            // Need at least 5 seconds (intro duration) but cap at 50% of video
            currentMinBuffer = Math.min(5, currentDuration * 0.5);
          } else {
            currentMinBuffer = 3;
          }
          
          // Check continuous buffer again
          let currentContinuousBuffer = 0;
          if (video.buffered.length > 0 && video.buffered.start(0) < 0.1) {
            currentContinuousBuffer = video.buffered.end(0);
          }
          
          // readyState 4 (HAVE_ENOUGH_DATA) like Posterco
          if (video.readyState >= 4 && currentContinuousBuffer >= currentMinBuffer) {
            const bufferPercent = currentDuration > 0 ? ((currentContinuousBuffer / currentDuration) * 100).toFixed(1) : 0;
            console.log('✅ Video ready! Starting intro animation');
            console.log('   Duration:', currentDuration.toFixed(1) + 's');
            console.log('   Continuous buffer:', currentContinuousBuffer.toFixed(1) + 's (' + bufferPercent + '%)');
            this.animationStarted = true;
            this.launchAnimation();
          }
        };
        
        // Listen for progress events (buffering)
        video.addEventListener('progress', onReady);
        video.addEventListener('canplaythrough', onReady); // This fires when readyState reaches 4
        
        // NO TIMEOUT - Wait indefinitely like Posterco
        // The preloader will stay visible until video is ready
        console.log('⏳ Waiting for video to be ready (no timeout - like Posterco)...');
      }
    };
    
    checkVideo();
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
    console.log('🎬 INTRO ANIMATION: Starting at', new Date().toLocaleTimeString());
    
    // Add intro-active class to hide logo during animation
    document.body.classList.add('intro-active');
    console.log('✓ Added intro-active class - logo hidden during animation');
    
    // Add lottie-started class for background transition
    this.$introWrapper.classList.add('lottie-started');
    
    // Start the CSS animation (already defined in CSS with delays)
    this.$intro.classList.add('animating');

    // Cinematic Bloom & Glow: 1.4s per letter + 0.05s × 13 stagger ≈ 2.05s
    // Add 200ms safety buffer = 2200ms total
    setTimeout(() => {
      this.onAnimationEnded();
    }, 2200);
  }

  onAnimationEnded() {
    // Prevent duplicate calls
    if (this._animationEndedCalled) {
      console.log('⏭️ onAnimationEnded already called, skipping duplicate');
      return;
    }
    this._animationEndedCalled = true;
    
    // This only runs on homepage now
    console.log('🎯 INTRO ANIMATION: Animation ended at', new Date().toLocaleTimeString(), '- transitioning to header logo');
    
    // Get preloader logo element for position tracking
    const preloaderLogo = this.$intro.querySelector('.intro-logo-svg') || this.$intro.querySelector('.intro-text-animation');
    const headerLogo = document.querySelector('.header__logo');
    
    // Log initial positions
    if (preloaderLogo) {
      const preloaderRect = preloaderLogo.getBoundingClientRect();
      console.log('📍 PRELOADER POSITION (before upward movement):');
      console.log('   Top:', preloaderRect.top + 'px');
      console.log('   Left:', preloaderRect.left + 'px');
      console.log('   Width:', preloaderRect.width + 'px');
      console.log('   Height:', preloaderRect.height + 'px');
    }
    
    if (headerLogo) {
      const headerRect = headerLogo.getBoundingClientRect();
      console.log('📍 HEADER LOGO POSITION (target):');
      console.log('   Top:', headerRect.top + 'px');
      console.log('   Left:', headerRect.left + 'px');
      console.log('   Width:', headerRect.width + 'px');
      console.log('   Height:', headerRect.height + 'px');
    }
    
    // Add completion class - this triggers the upward movement via CSS
    this.$introWrapper.classList.add('lottie-ended');
    this.animationComplete = true;
    
    console.log('🚀 UPWARD MOVEMENT: Started (0.8s CSS transition)');
    
    // Track position during animation (sample at intervals)
    let sampleCount = 0;
    const sampleInterval = setInterval(() => {
      if (preloaderLogo && sampleCount < 8) {
        const rect = preloaderLogo.getBoundingClientRect();
        const progress = ((sampleCount + 1) / 8 * 100).toFixed(0);
        console.log(`📊 UPWARD MOVEMENT [${progress}%]: Top=${rect.top.toFixed(1)}px, Opacity=${window.getComputedStyle(preloaderLogo).opacity}`);
        sampleCount++;
      } else {
        clearInterval(sampleInterval);
      }
    }, 100); // Sample every 100ms during 800ms transition
    
    // CRITICAL: Keep preloader logo visible during upward movement (0.8s transition)
    // Then fade it out and show header logo
    setTimeout(() => {
      if (preloaderLogo) {
        const finalRect = preloaderLogo.getBoundingClientRect();
        console.log('📍 PRELOADER POSITION (after upward movement):');
        console.log('   Top:', finalRect.top + 'px');
        console.log('   Left:', finalRect.left + 'px');
      }
      
      // Show header logo INSTANTLY when preloader reaches header position
      if (headerLogo) {
        // Make sure logo has src set
        if (!headerLogo.src || headerLogo.src.includes('undefined')) {
          const presetConfig = window.__headerPreset;
          if (presetConfig && presetConfig.logo && presetConfig.logo.src) {
            headerLogo.src = presetConfig.logo.src;
            console.log('✓ Header logo src set:', presetConfig.logo.src);
          }
        }
        
        // Show header logo instantly (no transition delay)
        headerLogo.style.opacity = '1';
        headerLogo.style.transition = 'none'; // Remove transition for instant appearance
        headerLogo.classList.add('loaded');
        
        const headerRect = headerLogo.getBoundingClientRect();
        console.log('✓ Header logo visible instantly at:');
        console.log('   Top:', headerRect.top + 'px');
        console.log('   Left:', headerRect.left + 'px');
        console.log('   Opacity:', window.getComputedStyle(headerLogo).opacity);
        
        // Re-enable transitions after a frame for future interactions
        setTimeout(() => {
          headerLogo.style.transition = '';
        }, 50);
      }
      
      // Fade out the preloader logo now that header logo is visible
      if (preloaderLogo) {
        preloaderLogo.style.transition = 'opacity 0.2s ease';
        preloaderLogo.style.opacity = '0';
        console.log('✓ Preloader logo fading out');
      }
    }, 800); // Wait for upward movement to complete (0.8s CSS transition)
    
    // Remove intro-active class
    document.body.classList.remove('intro-active');
    console.log('✓ Removed intro-active class');

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
      console.log('🏁 INTRO ANIMATION: Adding intro-ended class at', new Date().toLocaleTimeString(), '- intro hidden');
      if (document.scrollingElement) {
        document.scrollingElement.classList.add('intro-ended');
      }
      document.body.classList.add('intro-ended');
      
      // Hide the entire intro wrapper after transition
      setTimeout(() => {
        this.$introWrapper.style.display = 'none';
        console.log('✅ INTRO ANIMATION: Intro wrapper hidden completely at', new Date().toLocaleTimeString());
      }, 500);
    }, 1000); // Increased to 1000ms to account for logo swap

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