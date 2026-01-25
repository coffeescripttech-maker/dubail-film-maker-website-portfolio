/**
 * CSS Text Animation for DUBAIFILMMAKER
 * Replaces Lottie animation with CSS-based text reveal
 */

class IntroTextAnimation {
  constructor(wrapper, config = {}) {
    this.$introWrapper = wrapper;
    this.$intro = null;
    this.$timeline = null;
    this.animationComplete = false;
    this.animationDuration = 2000; // 2 seconds total (matching Lottie 50 frames @ 25fps)
    
    // Configuration
    this.config = {
      text: config.text || 'DUBAIFILMMAKER',
      initialLetters: config.initialLetters || [0, 9, 10, 11, 12, 13], // Default: D and MAKER (indices)
      // OR use letter-based config:
      initialPattern: config.initialPattern || null, // e.g., 'DMAKER' or 'DR'
      holdDuration: config.holdDuration || 3000, // How long to show initial letters
      revealStartTime: config.revealStartTime || 3480, // When to start revealing other letters
      letterDelays: config.letterDelays || null // Custom delays for each letter
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
    // Clear existing content
    this.$intro.innerHTML = '';

    // Create text container
    const textContainer = document.createElement('div');
    textContainer.className = 'intro-text-animation';

    const text = this.config.text;
    
    // Determine which letters should be initially visible
    let initialIndices = this.config.initialLetters;
    
    // If initialPattern is provided, calculate indices from pattern
    if (this.config.initialPattern) {
      initialIndices = this.getIndicesFromPattern(text, this.config.initialPattern);
    }
    
    // Split text into individual letters
    text.split('').forEach((letter, index) => {
      const span = document.createElement('span');
      span.className = 'letter';
      
      // Check if this letter should be initially visible
      if (initialIndices.includes(index)) {
        span.classList.add('letter-initial');
        span.setAttribute('data-initial', 'true');
      }
      
      span.textContent = letter;
      span.setAttribute('data-index', index);
      textContainer.appendChild(span);
    });

    this.$intro.appendChild(textContainer);
    
    // Apply dynamic animation delays
    this.applyAnimationDelays(initialIndices);
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
    console.log('Animation ended, adding lottie-ended class');
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

    // After 800ms, add intro-ended class to complete the exit animation
    setTimeout(() => {
      console.log('Adding intro-ended class to document');
      if (document.scrollingElement) {
        document.scrollingElement.classList.add('intro-ended');
      }
      // Also add to body as fallback
      document.body.classList.add('intro-ended');
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
