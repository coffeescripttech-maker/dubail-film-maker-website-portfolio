# Seamless build.min.js Solution

## Problem
- Posterco.tv: Videos are pre-rendered in HTML → build.min.js finds them immediately → works perfectly
- Our site: Videos are fetched and inserted dynamically → build.min.js runs before videos exist → doesn't work

## Solution: Pre-render Placeholder Videos

Instead of dynamically creating videos from scratch, pre-render placeholder videos in the HTML that build.min.js can find immediately, then update them with API data.

## Implementation

### Step 1: Add Placeholder Videos to HTML

In `index.html`, inside `.box--home__wrapper`, add 6 placeholder videos:

```html
<div class="box--home__wrapper video-wrapper" id="homepage-main-video-wrapper">
  <!-- Placeholder videos - will be updated with API data -->
  <video class="js-main-video visible loaded" data-src="" muted playsinline></video>
  <video class="js-main-video" data-src="" muted playsinline></video>
  <video class="js-main-video" data-src="" muted playsinline></video>
  <video class="js-main-video" data-src="" muted playsinline></video>
  <video class="js-main-video" data-src="" muted playsinline></video>
  <video class="js-main-video" data-src="" muted playsinline></video>
</div>
```

### Step 2: Update Script to Populate Existing Videos

Instead of creating new videos, update the existing ones:

```javascript
function updateVideoElements(projects) {
  const videoWrapper = document.querySelector('.box--home__wrapper');
  const existingVideos = videoWrapper.querySelectorAll('video.js-main-video');
  
  projects.forEach((project, index) => {
    if (existingVideos[index]) {
      const video = existingVideos[index];
      const videoUrl = project.video_thumbnail_url || project.video_url;
      
      // Update data-src
      video.setAttribute('data-src', videoUrl);
      
      // Set src and load
      video.src = videoUrl;
      video.load();
      
      console.log(`✓ Updated video ${index + 1} with ${videoUrl}`);
    }
  });
  
  // First video should start playing
  if (existingVideos[0] && existingVideos[0].readyState >= 2) {
    existingVideos[0].play().catch(err => console.log('Autoplay prevented'));
  }
}
```

## Benefits

1. **build.min.js works immediately** - Videos exist when it initializes
2. **No timing issues** - build.min.js's `launch()` finds videos right away
3. **Seamless like posterco.tv** - Same structure, same behavior
4. **Progressive enhancement** - Works even if API fails (shows placeholders)

## Alternative: SSR/SSG

For production, consider:
- **Server-Side Rendering (SSR)**: Generate HTML with real video URLs on the server
- **Static Site Generation (SSG)**: Pre-build HTML with video data at build time
- **Hybrid**: Pre-render first 6 videos, lazy-load the rest

This is how posterco.tv does it - the HTML is generated with real data before being sent to the browser.
