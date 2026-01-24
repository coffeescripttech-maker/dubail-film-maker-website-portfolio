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
    const text = 'DUBAIFILMMAKER';
    text.split('').forEach(letter => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = letter;
      textContainer.appendChild(span);
    });

    this.$intro.appendChild(textContainer);
  }

  bind() {
    // Listen for main video buffer progress
    if (window.a && window.a.mainPlayerBuffer) {
      window.a.mainPlayerBuffer.listen(this.onBuffer);
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

    // After animation completes, trigger end sequence
    setTimeout(() => {
      this.onAnimationEnded();
    }, this.animationDuration);
  }

  onAnimationEnded() {
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
      if (document.scrollingElement) {
        document.scrollingElement.classList.add('intro-ended');
      }
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
