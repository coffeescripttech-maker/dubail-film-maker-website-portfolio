/**
 * Dynamic Content Re-initialization
 * Re-initializes build.min.js features after dynamic content loads
 * Listens for 'slider-rendered' and 'projects-rendered' events
 */

// Re-initialize cursor player for homepage slider after dynamic content loads
window.addEventListener('slider-rendered', function() {
  console.log('🔄 Re-initializing cursor player for homepage slider...');
  
  const sliderContainer = document.querySelector('.list--home.js-has-cursor-player');
  if (!sliderContainer) {
    console.warn('Slider container not found');
    return;
  }
  
  const cursorPlayer = sliderContainer.querySelector('.js-cursor-player-animated');
  if (!cursorPlayer) {
    console.warn('Cursor player not found in slider');
    return;
  }
  
  const playerVideos = cursorPlayer.querySelectorAll('.player-animated-player');
  console.log(`Found ${playerVideos.length} cursor player videos to initialize`);
  
  // Initialize cursor player positioning
  const moovingElements = cursorPlayer.querySelectorAll('.mooving-elements');
  const sliderRect = sliderContainer.getBoundingClientRect();
  
  // Set initial position to center
  moovingElements.forEach(el => {
    el.style.setProperty('--x', `${sliderRect.width / 2}px`);
    el.style.setProperty('--y', `${sliderRect.height / 2}px`);
  });
  
  // Track mouse movement to position cursor player
  sliderContainer.addEventListener('mousemove', function(e) {
    const rect = sliderContainer.getBoundingClientRect();
    const playersWrapper = cursorPlayer.querySelector('.players-wrapper');
    
    // Calculate X position (centered on cursor)
    const x = e.clientX - rect.left - (playersWrapper ? playersWrapper.offsetWidth / 2 : 0);
    // Calculate Y position (above cursor, like posterco.tv)
    const y = -(playersWrapper ? playersWrapper.offsetHeight : 0);
    
    // Update CSS custom properties for cursor position
    moovingElements.forEach(el => {
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    });
  });
  
  console.log('✓ Cursor player re-initialized with', playerVideos.length, 'videos');
  
  // Manually add cursor player visibility handlers
  sliderContainer.addEventListener('mouseenter', function() {
    cursorPlayer.classList.add('visible');
    console.log('✓ Cursor player visible (mouseenter on wrapper)');
  });
  
  sliderContainer.addEventListener('mousemove', function() {
    if (!cursorPlayer.classList.contains('visible')) {
      cursorPlayer.classList.add('visible');
      console.log('✓ Cursor player visible (mousemove on wrapper)');
    }
  });
  
  sliderContainer.addEventListener('mouseleave', function() {
    cursorPlayer.classList.remove('visible');
    playerVideos.forEach(video => video.pause());
    console.log('✓ Cursor player hidden (mouseleave from wrapper)');
  });
  
  // Re-initialize video switching for dynamically loaded content
  const listItems = sliderContainer.querySelectorAll('li');
  
  // Ensure all cursor player videos have src loaded
  playerVideos.forEach((video) => {
    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
    
    // Add 'loaded' class
    video.addEventListener('loadeddata', function() {
      this.classList.add('loaded');
      console.log('✓ Cursor player video loaded');
    }, { once: true });
  });
  
  listItems.forEach((item, index) => {
    // Handle mouseenter on LI - set data-player-active and switch video
    item.addEventListener('mouseenter', function() {
      sliderContainer.setAttribute('data-player-active', index);
      
      // Manually switch active video
      playerVideos.forEach((video, videoIndex) => {
        if (videoIndex === index) {
          video.currentTime = 0;
          video.play().catch(err => console.log('Play prevented:', err));
          video.classList.add('active');
        } else {
          video.pause();
          video.classList.remove('active');
        }
      });
      
      console.log(`✓ Set data-player-active to ${index} and switched to video ${index + 1}`);
    });
  });
  
  console.log('✓ Cursor player hover handlers set up');
}, { once: true });

console.log('✓ Dynamic content re-initialization script loaded');
