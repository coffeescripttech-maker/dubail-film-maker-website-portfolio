# Final Slider Solution - Let build.min.js Do Its Job!

## The Problem
We were creating custom arrow navigation handlers that **conflicted** with build.min.js's built-in handlers, causing the slider not to work properly.

## The Solution
**Remove our custom navigation code and let build.min.js handle everything!**

## What We Do (Minimal)
1. Fetch API data
2. Generate HTML with correct structure:
   - List items with `.js-change-video` class
   - Counter with format `1/6`
   - Arrow buttons with `.arrow-prev` / `.arrow-next` classes
3. Set first video source
4. **STOP** - Let build.min.js do the rest!

## What build.min.js Does (Automatically)
- ✅ Binds arrow button click handlers
- ✅ Handles prev/next navigation with looping
- ✅ Updates counter (1/6, 2/6, etc.)
- ✅ Toggles `.is-active` class on list items
- ✅ Updates video sources and plays/pauses
- ✅ Updates links (main link, mobile link)
- ✅ Updates cursor text
- ✅ Animates timeline progress bar
- ✅ Auto-advances when video ends
- ✅ Handles list item clicks

## Clean Implementation

### index.html (Simplified Script)
```html
<script>
  (async function() {
    const projects = await window.fetchProjects();
    
    if (projects.length > 0) {
      const sliderProjects = projects.slice(0, 6);
      window.__sliderProjects = sliderProjects;
      
      generateSliderHTML(sliderProjects);
      window.__sliderHTMLReady = true;
    }
    
    function generateSliderHTML(projects) {
      // Update counter
      const counter = document.querySelector('.box--home__info__counter');
      if (counter) {
        counter.innerHTML = `<span>1</span>/${projects.length}`;
      }
      
      // Generate list items with .js-change-video
      const listContainer = document.querySelector('.list--home');
      if (listContainer) {
        const existingItems = listContainer.querySelectorAll('li');
        existingItems.forEach(item => item.remove());
        
        projects.forEach((project, index) => {
          const li = document.createElement('li');
          if (index === 0) li.classList.add('is-active');
          
          li.innerHTML = `
            <a href="${project.link}" class="js-change-video">
              <h2>${project.title}</h2>
              <p>${project.client_short || project.client}</p>
              <p>${project.classification}</p>
            </a>
          `;
          
          listContainer.appendChild(li);
        });
      }
      
      // Set first video
      const mainVideo = document.querySelector('.js-main-video');
      if (mainVideo && projects[0]) {
        mainVideo.src = projects[0].video_url;
      }
      
      // Update initial links and text
      const mainLink = document.querySelector('.box--home__link');
      if (mainLink && projects[0]) {
        mainLink.href = projects[0].link;
      }
      
      const mobileLink = document.querySelector('.mobile-link');
      if (mobileLink && projects[0]) {
        mobileLink.href = projects[0].link;
      }
      
      const cursorText = document.querySelector('.cursor-main-text');
      if (cursorText && projects[0]) {
        cursorText.textContent = `open ${projects[0].title}`;
      }
    }
  })();
</script>
```

## Key Points

### 1. NO Custom Arrow Handlers
❌ **DON'T DO THIS:**
```javascript
prevBtn.addEventListener('click', function(e) {
  // Custom navigation logic
});
```

✅ **DO THIS:**
```javascript
// Nothing! build.min.js handles it
```

### 2. Use Correct CSS Classes
build.min.js looks for these specific selectors:
- `.js-change-video` - On the `<a>` tag inside each `<li>`
- `.arrow-prev` / `.arrow-next` - Arrow buttons
- `.box--home__info__counter span` - Counter number
- `.box--home__link` - Main project link
- `.mobile-link` - Mobile view project button
- `.cursor-main-text` - Cursor hover text

### 3. Single Video Approach
We use ONE video element and change its `src`:
```html
<video class="js-main-video" src="project1.mp4"></video>
```

build.min.js expects multiple videos, but our approach works because:
- We only have one video at index 0
- build.min.js tries to play video at `currentlyPlaying` index
- When `currentlyPlaying = 0`: ✅ Plays
- When `currentlyPlaying > 0`: ❌ Tries to play non-existent video

### 4. The Fix for Single Video
We need to intercept build.min.js's `changeVideo()` function to update our single video's `src` instead of showing/hiding multiple videos.

**Option A: Hook into changeVideo (Recommended)**
```javascript
// After build.min.js loads, override its changeVideo behavior
window.addEventListener('DOMContentLoaded', function() {
  // Find the Home instance
  const homeInstance = window.ze?.[0]; // ze is the array of Home instances
  
  if (homeInstance) {
    const originalChangeVideo = homeInstance.changeVideo;
    
    homeInstance.changeVideo = function(index) {
      // Update our single video's src
      const project = window.__sliderProjects[index];
      const mainVideo = document.querySelector('.js-main-video');
      
      if (mainVideo && project) {
        mainVideo.src = project.video_url;
        mainVideo.load();
        mainVideo.play().catch(() => {});
      }
      
      // Call original function for other updates
      originalChangeVideo.call(this, index);
    };
  }
});
```

**Option B: Generate Multiple Videos (Simpler)**
```javascript
// In generateSliderHTML():
const videoWrapper = document.querySelector('.box--home__wrapper');
videoWrapper.innerHTML = '';

projects.forEach((project, index) => {
  const video = document.createElement('video');
  video.className = 'js-main-video';
  if (index === 0) video.classList.add('visible');
  video.src = project.video_url;
  video.muted = true;
  video.playsinline = true;
  videoWrapper.appendChild(video);
});
```

## Testing Checklist
- [ ] Counter shows 1/6, 2/6, etc.
- [ ] Arrow buttons navigate between projects
- [ ] Videos switch and auto-play
- [ ] Timeline animates during playback
- [ ] Clicking list items switches projects
- [ ] Auto-advance when video ends
- [ ] Looping works (last → first, first → last)
- [ ] Mobile view project button updates
- [ ] Cursor text updates on hover

## Files to Update
1. `index.html` - Replace slider script with clean version from `index_slider_script.html`
2. Test and verify all functionality works

## Next Steps
1. Copy content from `index_slider_script.html` into `index.html`
2. Test the slider
3. If videos don't switch, implement Option B (multiple videos)
