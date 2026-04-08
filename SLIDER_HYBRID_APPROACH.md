# Slider Hybrid Approach

## Strategy

Combine the best of both approaches:

1. **video-preloader.js** - Creates first video during intro (KEEP AS IS)
2. **Inline script** - Generates slider content (KEEP, but MODIFY)
3. **Add preload detection** - Don't clear the preloaded video

## Modified generateVideoElements Function

Instead of:
```javascript
// ❌ OLD: Clears everything including preloaded video
videoWrapper.innerHTML = '';
```

Use:
```javascript
// ✅ NEW: Check for preloaded video first
const preloadVideo = window.__preloadVideo || videoWrapper.querySelector('#preload-video');
const firstVideoUrl = projects[0].video_url;

if (preloadVideo && preloadVideo.src.includes(firstVideoUrl.split('/').pop())) {
  // Keep preloaded video, just add remaining 5
  console.log('✅ Keeping preloaded video');
} else {
  // No preload, clear and create all 6
  videoWrapper.innerHTML = '';
}
```

## Complete Modified Function

```javascript
function generateVideoElements(projects) {
  const videoWrapper = document.querySelector('.box--home__wrapper');
  if (!videoWrapper) return;
  
  // Check if first video is already preloaded
  const preloadVideo = window.__preloadVideo || videoWrapper.querySelector('#preload-video');
  const firstVideoUrl = projects[0].video_url;
  
  if (preloadVideo && preloadVideo.src && preloadVideo.src.includes(firstVideoUrl.split('/').pop())) {
    console.log('✅ VIDEO PRELOAD: Keeping existing preloaded video');
    console.log('📊 VIDEO PRELOAD: readyState:', preloadVideo.readyState);
    
    // Ensure it has the right classes
    if (!preloadVideo.classList.contains('js-main-video')) {
      preloadVideo.classList.add('js-main-video');
    }
    if (!preloadVideo.classList.contains('visible')) {
      preloadVideo.classList.add('visible');
    }
    if (!preloadVideo.classList.contains('loaded')) {
      preloadVideo.classList.add('loaded');
    }
    
    // Generate remaining 5 videos (skip first one)
    projects.slice(1).forEach((project, index) => {
      const video = document.createElement('video');
      video.className = 'js-main-video';
      video.src = project.video_url;
      video.muted = true;
      video.playsinline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      
      videoWrapper.appendChild(video);
    });
    
    console.log('Generated', projects.length - 1, 'additional video elements (kept preloaded first video)');
  } else {
    console.log('⚠️ No preloaded video found, creating all videos');
    
    // Clear and create all 6 videos
    videoWrapper.innerHTML = '';
    
    projects.forEach((project, index) => {
      const video = document.createElement('video');
      video.className = 'js-main-video';
      
      if (index === 0) {
        video.classList.add('visible', 'loaded');
      }
      
      video.src = project.video_url;
      video.muted = true;
      video.playsinline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      
      videoWrapper.appendChild(video);
    });
    
    console.log('Generated', projects.length, 'video elements');
    
    // Load first video
    const firstVideo = videoWrapper.querySelector('video.js-main-video.visible');
    if (firstVideo) {
      firstVideo.load();
      firstVideo.addEventListener('canplay', function() {
        if (this.paused) {
          this.play().catch(err => console.log('Autoplay blocked:', err.message));
        }
      }, { once: true });
    }
  }
  
  // Load other videos with delay
  const otherVideos = videoWrapper.querySelectorAll('video.js-main-video:not(.visible)');
  otherVideos.forEach((video, index) => {
    setTimeout(() => video.load(), (index + 1) * 100);
  });
}
```

## Benefits

1. ✅ Keeps working inline script approach
2. ✅ Detects and reuses preloaded video
3. ✅ No duplicate video download
4. ✅ Instant playback (video already buffered)
5. ✅ Fallback if preload fails

## Implementation

Just replace the `generateVideoElements` function in the inline script with the modified version above.
