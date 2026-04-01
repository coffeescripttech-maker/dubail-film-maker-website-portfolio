# Preloader Text Positioning Guide

## Header CSS Values from build.min.css

### Mobile (≤767px)
```css
.header {
  left: 0;
  margin: 20px 20px 0;  /* 20px top, 20px left/right, 0 bottom */
  position: absolute;
  right: 0;
  top: 0;
}
```

### Desktop (≥768px)
```css
.header {
  left: auto;
  margin: 0 30px;  /* 0 top/bottom, 30px left/right */
  padding-top: 17px;
  position: relative;
}
```

## Preloader Text Positioning Strategy

To make the preloader text land in the EXACT same position as the header:

### Mobile
- Header is at: `top: 0` + `margin-top: 20px` = **20px from top**
- Header has: `margin-left: 20px` and `margin-right: 20px`
- Transform should move text to: `translateY(calc(var(--ivh) / 2 * -1 + 20px))`
- Wrapper padding should be: `0 20px`

### Desktop  
- Header is at: `padding-top: 17px` + `margin: 0 30px`
- Total from top: **17px**
- Transform should move text to: `translateY(calc(var(--ivh) / 2 * -1 + 17px))`
- Wrapper padding should be: `0 30px`

## Current Implementation Issues

The current transforms are:
- Mobile: `60px` (should be `20px`)
- Desktop: `47px` (should be `17px`)

These values are too large, pushing the text too far down.

## Recommended Fix

Update `intro-text-animation.css`:

```css
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  /* Mobile: match header margin-top exactly */
  transform: translateY(calc(var(--ivh) / 2 * -1 + 20px)) !important;
}

@media (min-width: 768px) {
  .bloc-intro.lottie-ended .intro-anim-surwrapper {
    /* Desktop: match header padding-top exactly */
    transform: translateY(calc(var(--ivh) / 2 * -1 + 17px)) !important;
  }
}
```

This will position the text at the EXACT same location as the header logo would be.
