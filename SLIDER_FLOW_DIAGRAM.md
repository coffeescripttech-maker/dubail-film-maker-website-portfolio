# Slider Implementation Flow Diagram

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         PAGE LOAD                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   video-preloader.js                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Fetch projects from API                                │  │
│  │ 2. Get first video URL                                    │  │
│  │ 3. Create <video id="preload-video">                      │  │
│  │ 4. Set src and call load()                                │  │
│  │ 5. Store: window.__preloadVideo                           │  │
│  │           window.__firstVideoUrl                          │  │
│  │           window.__projectsPreloadPromise                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   INTRO ANIMATION PLAYS                          │
│              (Video downloads in background)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   index.html inline script                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Await window.__projectsPreloadPromise                  │  │
│  │ 2. Call PageRenderer.renderHomepageSlider(projects)       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              PageRenderer.renderHomepageSlider()                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ STEP 1: Check for preloaded video                         │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ const preloadVideo = window.__preloadVideo          │   │  │
│  │ │ if (preloadVideo exists && URL matches) {           │   │  │
│  │ │   ✅ REUSE preloaded video                          │   │  │
│  │ │   Set autoplay attribute                            │   │  │
│  │ │   Check readyState and play if ready               │   │  │
│  │ │ } else {                                            │   │  │
│  │ │   ⚠️ CREATE new video element                       │   │  │
│  │ │   Set src and load()                                │   │  │
│  │ │ }                                                   │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ STEP 2: Generate remaining 5 videos                       │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ updateMainVideoSection(projects)                    │   │  │
│  │ │ - Create video elements for projects 2-6            │   │  │
│  │ │ - Add to video wrapper                              │   │  │
│  │ │ - Load with delay to prioritize first video        │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ STEP 3: Render list items + cursor player                │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ renderSliderContent(container, projects)            │   │  │
│  │ │ - Generate cursor player with 6 hover videos        │   │  │
│  │ │ - Generate list items with .js-change-video         │   │  │
│  │ │ - Load cursor player videos                         │   │  │
│  │ │ - Dispatch 'slider-rendered' event                  │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ STEP 4: Update counter and links                          │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ updateSliderCounter(count)                          │   │  │
│  │ │ updateSliderLinks(firstProject)                     │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   build.min.js takes over                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ - Detects .js-change-video links                          │  │
│  │ - Binds arrow button handlers                             │  │
│  │ - Initializes cursor player (.js-cursor-player-animated)  │  │
│  │ - Handles video switching on navigation                   │  │
│  │ - Updates counter, timeline, active states                │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SLIDER FULLY FUNCTIONAL                        │
│  ✅ First video playing (already buffered)                       │
│  ✅ List items visible and clickable                             │
│  ✅ Cursor player showing hover previews                         │
│  ✅ Arrow navigation working                                     │
│  ✅ Counter updating (1/6, 2/6, etc.)                            │
│  ✅ Timeline animating                                           │
│  ✅ Auto-advance working                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Key Decision Points

### 1. Preload Video Detection
```javascript
// page-renderer.js line ~270
const preloadVideo = window.__preloadVideo || document.getElementById('preload-video');
const firstVideoUrl = window.__firstVideoUrl || projects[0].video_url;

if (preloadVideo && preloadVideo.src.includes(firstVideoUrl.split('/').pop())) {
  // ✅ REUSE PATH: Video already downloading/buffered
  console.log('✅ Using existing preloaded video');
} else {
  // ⚠️ FALLBACK PATH: Create new video
  console.log('⚠️ Creating new video element');
}
```

### 2. Video State Handling
```javascript
// Check readyState to determine action
if (preloadVideo.readyState >= 3) {
  // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
  if (preloadVideo.paused) {
    preloadVideo.play(); // Play immediately
  } else {
    // Already playing, do nothing
  }
} else {
  // Still loading, will auto-play when ready
}
```

## Performance Benefits

### Without Preload
```
Intro ends → Fetch API → Create video → Start download → Wait → Play
Total time: ~2-3 seconds
```

### With Preload
```
Page load → Start download (background during intro) → Intro ends → Play
Total time: ~0.1 seconds (instant playback)
```

## Code Reduction

### Before (Inline Script)
- **Lines**: ~180 lines of duplicate code
- **Functions**: 3 custom functions (generateListItems, generateVideoElements, updateInitialState)
- **Maintenance**: Must update in multiple places

### After (Use PageRenderer)
- **Lines**: ~20 lines of simple delegation
- **Functions**: Reuse proven page-renderer.js functions
- **Maintenance**: Single source of truth

## Related Files

1. `assets/js/video-preloader.js` - Early preload logic
2. `assets/js/page-renderer.js` - Slider rendering (lines 250-720)
3. `index.html` - Simple delegation script (lines 575-600)
4. `assets/dist/build.min.js` - Navigation handling

## Testing Commands

```bash
# Check console for preload logs
# Look for: "✅ VIDEO PRELOAD: Using existing preloaded video"

# Check video element
# Should have: id="preload-video", class="js-main-video visible loaded"

# Check buffered state
# Should show: "Buffered: 100%" or high percentage
```
