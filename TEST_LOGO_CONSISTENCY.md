# Test Logo Consistency - Quick Guide

## What to Test

### Test 1: Homepage Animation
1. Open homepage in browser
2. Watch preloader animation
3. Verify "DMAKER" appears first
4. Verify full "DUBAIFILMMAKER" reveals letter by letter
5. Verify text moves UP to header position
6. Verify text stays visible (doesn't fade out)
7. Verify text is WHITE color

**Expected Result**: Smooth animation with text moving to header and staying visible as the logo

### Test 2: Navigate to Works Page
1. From homepage, click "Works" link
2. Verify text logo appears in header (no animation)
3. Verify text is WHITE color (dark background)
4. Verify NO SVG logo is visible
5. Scroll page to verify logo stays in position

**Expected Result**: Text logo appears immediately in header position with white color

### Test 3: Navigate to About Page
1. From any page, click "About" link
2. Verify text logo appears in header (no animation)
3. Verify text is BLACK color (light background)
4. Verify NO SVG logo is visible
5. Scroll page to verify logo stays in position

**Expected Result**: Text logo appears immediately in header position with black color

### Test 4: Navigate to Contact Page
1. From any page, click "Contact" link
2. Verify text logo appears in header (no animation)
3. Verify text is BLACK color (light background)
4. Verify NO SVG logo is visible
5. Scroll page to verify logo stays in position

**Expected Result**: Text logo appears immediately in header position with black color

### Test 5: Direct URL Access (Non-Homepage First)
1. Clear browser cache and sessionStorage
2. Navigate directly to `/works` or `/about` or `/contact`
3. Verify text logo appears (even without visiting homepage first)
4. Verify correct color for page background
5. Navigate to homepage
6. Verify preloader animation works

**Expected Result**: Text logo works on all pages regardless of entry point

### Test 6: Mobile Responsiveness
1. Open site on mobile device or use browser dev tools
2. Test all pages (Homepage, Works, About, Contact)
3. Verify text logo is properly sized
4. Verify text logo doesn't overlap with menu button
5. Verify correct colors on each page

**Expected Result**: Text logo displays correctly on all screen sizes

## Console Logs to Check

Open browser console and look for these messages:

### On Homepage:
```
🚀 intro-text-animation.js loaded - VERSION 2
🎯 Animation ended, text will move up and stick to header
✓ Stored logo text in sessionStorage: DUBAIFILMMAKER
✓ Preloader text will stay visible during movement
Adding intro-ended class - text moving to header position
✓ Text should now be at header position
```

### On Other Pages:
```
🔤 Text Logo Handler loaded
✓ Default logo text set in sessionStorage
🔍 replaceLogoWithText called
Logo type from sessionStorage: text
Logo text from sessionStorage: DUBAIFILMMAKER
✓ SVG logo hidden
✓ Updated text logo color to: #000000 (light bg: true)
✓ Added intro-ended class to body
```

## Common Issues and Solutions

### Issue: SVG logo showing instead of text
**Solution**: Check that `text-logo-handler.js` is loaded after `site-config.js` in HTML

### Issue: Text logo wrong color
**Solution**: Verify body has correct template class (`template-about`, `template-contact`, etc.)

### Issue: Text logo animating on non-homepage pages
**Solution**: Verify `.bloc-intro` has only `intro-ended` class (not `lottie-started` or `lottie-ended`)

### Issue: Text logo not appearing at all
**Solution**: Check browser console for errors, verify CSS file is loaded

## Browser Testing

Test in these browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (desktop and iOS)
- ✅ Mobile browsers (Chrome, Safari)

## Performance Check

- Logo should appear instantly (no flash or delay)
- No layout shift when logo loads
- Smooth animation on homepage
- No jank or stuttering during transitions

## Accessibility Check

- Logo text is readable
- Sufficient contrast on all backgrounds
- Logo doesn't interfere with navigation
- Keyboard navigation works correctly

---

**Status**: All tests should pass after implementation
**Last Updated**: Current session
