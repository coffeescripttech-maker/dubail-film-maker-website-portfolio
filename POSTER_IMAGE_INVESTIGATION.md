# Poster Image Investigation

## Current Data Structure

For project "Moving Forward":
```json
{
  "poster_image": "https://pub-e4e29f1338964c2d89ce48344d55d9fe.r2.dev/thumbnails/video-frames/6d5bba7a-7029-4e8c-9346-5aca642989c0/frame-3_00s-large.jpg",
  "poster_image_srcset": "https://pub-e4e29f1338964c2d89ce48344d55d9fe.r2.dev/projects/posters/1766181809764-15_-_Moving_Forward.png 300w, https://pub-e4e29f1338964c2d89ce48344d55d9fe.r2.dev/projects/posters/1766181809764-15_-_Moving_Forward.png 600w, ..."
}
```

## How It's Rendered

In `page-renderer.js`:
```html
<img class="video-img-poster lazy-media loaded"
  src="${project.poster_image}"
  srcset="${project.poster_image_srcset}"
  alt="">
```

## Browser Behavior

When both `src` and `srcset` are present:
1. Browser uses `srcset` to choose the best image based on screen size
2. `src` is used as fallback if `srcset` is not supported or no match found
3. Modern browsers will prefer `srcset` over `src`

## Current Issue

- `poster_image` (src) = video frame thumbnail (wrong)
- `poster_image_srcset` (srcset) = actual poster image (correct)

## Expected Behavior

Since `srcset` is present and contains the correct poster images, the browser SHOULD display the correct poster image from the srcset, not the video frame from src.

## Possible Issues

1. **srcset not loading**: If srcset fails to load, browser falls back to src (video frame)
2. **Data mismatch**: The CMS might be setting poster_image incorrectly
3. **Lazy loading**: The lazy loading might not be handling srcset properly

## Solution Options

### Option 1: Fix at CMS Level (Recommended)
Update the CMS to set `poster_image` to the actual poster URL, not the video frame:
```json
{
  "poster_image": "https://pub-e4e29f1338964c2d89ce48344d55d9fe.r2.dev/projects/posters/1766181809764-15_-_Moving_Forward.png",
  "poster_image_srcset": "https://pub-e4e29f1338964c2d89ce48344d55d9fe.r2.dev/projects/posters/1766181809764-15_-_Moving_Forward.png 300w, ..."
}
```

### Option 2: Fix at Frontend Level
Extract the base URL from srcset and use it for src:
```javascript
// If srcset exists, use first image from srcset as src
const posterSrc = project.poster_image_srcset 
  ? project.poster_image_srcset.split(',')[0].trim().split(' ')[0]
  : project.poster_image;
```

### Option 3: Remove src, use only srcset
```html
<img class="video-img-poster lazy-media loaded"
  srcset="${project.poster_image_srcset}"
  alt="">
```
⚠️ Not recommended - src is required for fallback support

## Recommendation

**Fix at CMS level** - The `poster_image` field should contain the actual poster image URL, not a video frame. The video frame should be a separate field if needed (e.g., `thumbnail_image` or `video_frame`).

## Testing

Added console logging to verify which images are being used:
```javascript
console.log(`[${project.title}] Poster Image:`, {
  poster_image: project.poster_image,
  poster_image_srcset: project.poster_image_srcset,
  has_srcset: !!project.poster_image_srcset
});
```

Check browser DevTools Network tab to see which image is actually loaded.
