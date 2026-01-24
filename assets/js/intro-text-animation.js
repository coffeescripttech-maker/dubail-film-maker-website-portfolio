/**
 * CSS Text Animation for DUBAIFILMMAKER
 * Replaces Lottie animation with CSS-based text reveal
 */

class IntroTextAnimation {
  constructor(wrapper) {
    this.$introWrapper = wrapper;
    this.$intro = null;
    this.$timeline = null;
    this.animationComplete = false;
    this.animationDuration = 2000; // 2 seconds total (matching Lottie 50 frames @ 25fps)
    
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

    // Split "DUBAIFILMMAKER" into individual letters
    // D-U-B-A-I-F-I-L-M-M-A-K-E-R
    // 0-1-2-3-4-5-6-7-8-9-10-11-12-13
    const text = 'DUBAIFILMMAKER';
    text.split('').forEach((letter, index) => {
      const span = document.createElement('span');
      span.className = 'letter';
      
      // Initial letters: D (index 0) and MAKER (indices 9-13: M-A-K-E-R) 
      // D will slide LEFT, MAKER will slide RIGHT as one unit (like P and CO)
      if (index === 0) {
        span.classList.add('letter-slide-in'); // D slides LEFT like P
      } else if (index >= 9 && index <= 13) {
        span.classList.add('letter-exit'); // MAKER (M-A-K-E-R) slides RIGHT like CO
      }
      
      span.textContent = letter;
      textContainer.appendChild(span);
    });

    this.$intro.appendChild(textContainer);
  }

  bind() {
    // Listen for main video buffer progress
    if (window.a && window.a.mainPlayerBuffer) {
      window.a.mainPlayerBuffer.listen(this.onBuffer);
    } else {
      // Fallback: start animation immediately if no video buffer
      console.log('No video buffer found, starting animation immediately');
      setTimeout(() => this.launchAnimation(), 100);
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
