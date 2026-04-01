# Intro Animation Toggle Guide

## Overview
The homepage preloader now supports TWO animation types that can be toggled via configuration:

1. **Text Animation** - Letter-by-letter reveal of "DUBAIFILMMAKER"
2. **SVG Animation** - Logo fades in, then moves up to header

Both animations follow the same upward movement behavior where the logo/text moves from center to the header position and stays there.

## How to Toggle Between Animation Types

Edit `data/header.json` and change the `activePreset` or modify the `introAnimation.type` field:

### Option 1: Use Text Animation (Current Default)
```json
{
  "activePreset": "default",
  "presets": {
    "default": {
      "introAnimation": {
        "type": "text",
        "text": "DUBAIFILMMAKER",
        "initialPattern": "DMAKER",
        "holdDuration": 3000,
        "revealStartTime": 3480
      }
    }
  }
}
```

### Option 2: Use SVG Animation
```json
{
  "activePreset": "reversed",
  "presets": {
    "reversed": {
      "introAnimation": {
        "type": "svg",
        "logoSrc": "assets/img/logo/dubaifilmmaker-light.svg",
        "holdDuration": 2000,
        "fadeInDuration": 1000
      }
    }
  }
}
```

Or simply change the `activePreset` value:
```json
{
  "activePreset": "reversed"
}
```

## Configuration Options

### Text Animation Config
- `type`: "text"
- `text`: The text to display (e.g., "DUBAIFILMMAKER")
- `initialPattern`: Initial letters to show (e.g., "DMAKER")
- `holdDuration`: How long to show initial letters (ms)
- `revealStartTime`: When to start revealing other letters (ms)

### SVG Animation Config
- `type`: "svg"
- `logoSrc`: Path to SVG logo file
- `holdDuration`: How long to show logo before moving (ms)
- `fadeInDuration`: Duration of fade-in effect (ms)

## Animation Behavior

Both animation types:
1. Show in center of screen
2. Hold for configured duration
3. Move upward to header position
4. Stay visible as the header logo
5. Header SVG logo is hidden during this process

## Files Modified

1. `index.html` - Updated config passing to include `type`, `logoSrc`, `fadeInDuration`
2. `assets/js/intro-text-animation.js` - Added SVG animation support
3. `assets/css/intro-text-animation.css` - Added SVG animation styles
4. `data/header.json` - Configured both presets with different animation types

## Testing

1. Set `activePreset` to "default" - should see text animation
2. Set `activePreset` to "reversed" - should see SVG animation
3. Both should move up and stick to header position
4. Both should remain visible after animation completes

## Non-Homepage Pages

Non-homepage pages (About, Contact, Works) use static SVG logos directly in the header:
- Contact & About: `dubaifilmmaker-dark.svg`
- Works: `dubaifilmmaker-light.svg`

No animation runs on these pages.
