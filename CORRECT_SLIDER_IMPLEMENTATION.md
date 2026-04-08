# Correct Slider Implementation - Use page-renderer.js Functions!

## Discovery
The `page-renderer.js` file already has THREE perfect functions that handle everything correctly:

1. `renderSliderContent(container, projects)` - Generates list items with `.js-change-video`
2. `updateMainVideoSection(projects)` - **Generates MULTIPLE video elements** (one per project)
3. `updateSliderCounter(total)` - Updates counter

## Why This Is Perfect

### Multiple Videos (The Key!)
`updateMainVideoSection()` creates multiple `<video>` elements:
```javascript
projects.forEach((project, index) => {
  const video = document.createElement('video');
  video.className = 'js-main-video';
  if (index === 0) video.classList.add('visible', 'loaded');
  video.src = project.video_url;
  video.muted = true;
  video.playsinline = true;
  videoWrapper.appendChild(video);
});
```

This is EXACTLY what build.min.js expects! It will:
- Show/hide videos using `.visible` class
- Play video at index `currentlyPlaying`
- Pause all other videos

### List Items with Correct Classes
`renderSliderContent()` generates:
```html
<li class="is-active">
  <a href="${project.link}" class="js-change-video">
    <h2>${project.title}</h2>
    <p>${project.client}</p>
    <p>${project.classification}</p>
  </a>
</li>
```

Perfect! The `.js-change-video` class is exactly what build.min.js looks for.

## Implementation Strategy

### Option 1: Use page-renderer.js Functions Directly
```html
<script src="assets/js/page-renderer.js"></script>
<script>
  (async function() {
    const projects = await window.fetchProjects();
    
    if (projects.length > 0) {
      const sliderProjects = projects.slice(0, 6);
      
      // Use page-renderer functions
      const listContainer = document.querySelector('.list--home');
      if (listContainer) {
        window.PageRenderer.renderSliderContent(listContainer, sliderProjects);
      }
      
      window.PageRenderer.updateMainVideoSection(sliderProjects);
      window.PageRenderer.updateSliderCounter(sliderProjects.length);
      
      console.log('✅ Slider ready - build.min.js will handle navigation');
    }
  })();
</script>
```

### Option 2: Copy Functions Into index.html
Extract the three functions and inline them in index.html (if you don't want to load page-renderer.js).

## Complete Working Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... head content ... -->
</head>
<body class="template-homepage">
  <!-- ... page content ... -->
  
  <!-- Load dependencies -->
  <script src="assets/js/data-loader.js"></script>
  <script src="assets/dist/build.min.js"></script>
  
  <!-- Generate slider HTML -->
  <script>
    (async function() {
      console.log('🎬 Fetching API data...');
      
      try {
        const projects = await window.fetchProjects();
        
        if (projects.length > 0) {
          const sliderProjects = projects.slice(0, 6);
          window.__sliderProjects = sliderProjects;
          
          console.log(`✓ Loaded ${sliderProjects.length} projects`);
          
          // Generate list items
          generateListItems(sliderProjects);
          
          // Generate multiple video elements
          generateVideoElements(sliderProjects);
          
          // Update counter
          updateCounter(sliderProjects.length);
          
          console.log('✅ Slider ready - build.min.js handles navigation');
        }
      } catch (err) {
        console.error('API failed:', err);
      }
      
      function generateListItems(projects) {
        const listContainer = document.querySelector('.list--home');
        if (!listContainer) return;
        
        // Clear existing items
        const existingItems = listContainer.querySelectorAll('li');
        existingItems.forEach(item => item.remove());
        
        // Generate new items
        projects.forEach((project, index) => {
          const li = document.createElement('li');
          if (index === 0) li.classList.add('is-active');
          
          const link = project.link || `works/project-detail.html#id=${project.id}`;
          const displayClient = project.client_short || project.client;
          
          li.innerHTML = `
            <a href="${link}" class="js-change-video">
              <h2>${project.title}</h2>
              <p>${displayClient}</p>
              <p>${project.classification}</p>
            </a>
          `;
          
          listContainer.appendChild(li);
        });
        
        console.log('✓ Generated', projects.length, 'list items');
      }
      
      function generateVideoElements(projects) {
        const videoWrapper = document.querySelector('.box--home__wrapper');
        if (!videoWrapper) return;
        
        // Clear existing videos
        videoWrapper.innerHTML = '';
        
        // Generate one video per project
        projects.forEach((project, index) => {
          const video = document.createElement('video');
          video.className = 'js-main-video';
          
          // First video is visible
          if (index === 0) {
            video.classList.add('visible', 'loaded');
          }
          
          video.src = project.video_url || 'assets/video/video1.mp4';
          video.muted = true;
          video.playsinline = true;
          video.setAttribute('muted', '');
          video.setAttribute('playsinline', '');
          
          videoWrapper.appendChild(video);
        });
        
        // Load first video immediately
        const firstVideo = videoWrapper.querySelector('video.js-main-video');
        if (firstVideo) {
          firstVideo.load();
          
          // Auto-play when ready
          firstVideo.addEventListener('canplay', function() {
            if (this.paused) {
              this.play().catch(err => console.log('Autoplay blocked'));
            }
          }, { once: true });
        }
        
        // Load other videos with delay
        const otherVideos = videoWrapper.querySelectorAll('video.js-main-video:not(.visible)');
        otherVideos.forEach((video, index) => {
          setTimeout(() => video.load(), (index + 1) * 100);
        });
        
        console.log('✓ Generated', projects.length, 'video elements');
      }
      
      function updateCounter(total) {
        const counter = document.querySelector('.box--home__info__counter');
        if (counter) {
          counter.innerHTML = `<span>1</span>/${total}`;
        }
        
        // Update initial links
        const firstProject = window.__sliderProjects[0];
        if (!firstProject) return;
        
        const mainLink = document.querySelector('.box--home__link');
        if (mainLink) {
          mainLink.href = firstProject.link;
        }
        
        const mobileLink = document.querySelector('.mobile-link');
        if (mobileLink) {
          mobileLink.href = firstProject.link;
        }
        
        const cursorText = document.querySelector('.cursor-main-text');
        if (cursorText) {
          cursorText.textContent = `open ${firstProject.title}`;
        }
      }
    })();
  </script>
  
  <script src="assets/js/intro-logo-size-sync.js"></script>
  
  <!-- Video loading script -->
  <script>
    (function() {
      console.log('🎥 Waiting for slider...');
      
      const checkReady = setInterval(function() {
        if (window.__sliderProjects && window.__sliderProjects.length > 0) {
          clearInterval(checkReady);
          
          const firstVideo = document.querySelector('video.js-main-video.visible');
          if (firstVideo && firstVideo.readyState >= 3) {
            console.log('✅ Video ready');
          }
        }
      }, 50);
      
      setTimeout(() => clearInterval(checkReady), 5000);
    })();
  </script>
</body>
</html>
```

## Key Differences from Previous Approach

### Before (Single Video - WRONG)
```javascript
// Only one video, change src
const mainVideo = document.querySelector('.js-main-video');
mainVideo.src = projects[0].video_url;
```

### After (Multiple Videos - CORRECT)
```javascript
// One video per project
projects.forEach((project, index) => {
  const video = document.createElement('video');
  video.className = 'js-main-video';
  if (index === 0) video.classList.add('visible');
  video.src = project.video_url;
  videoWrapper.appendChild(video);
});
```

## How build.min.js Works With This

When you click an arrow or list item, build.min.js's `changeVideo(index)` function:

1. Loops through all `this.$videos` (now we have 6 videos!)
2. For each video at index `i`:
   - If `i === currentlyPlaying`: Add `.visible`, play video
   - Else: Remove `.visible`, pause video
3. Updates counter, links, cursor text
4. Animates timeline

**Perfect!** Now build.min.js can properly show/hide videos because we have multiple video elements.

## Testing Checklist
- [ ] Counter shows 1/6, 2/6, etc.
- [ ] Arrow buttons navigate (build.min.js handles this)
- [ ] Videos switch and auto-play
- [ ] Timeline animates
- [ ] Clicking list items switches videos
- [ ] Auto-advance when video ends
- [ ] Looping works
- [ ] Mobile button updates
- [ ] Cursor text updates

## Files Needed
1. Update `index.html` with the complete implementation above
2. That's it! No other changes needed.

The key was realizing that `page-renderer.js` already solved this problem by generating multiple video elements!
