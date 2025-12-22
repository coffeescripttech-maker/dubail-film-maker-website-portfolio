# Logo Configuration Guide

## Overview
The portfolio website now supports automatic logo switching based on page background color.

## Logo Variants in header.json

Each preset now has two logo options:
- **`src`**: Light logo (for dark backgrounds) - used on index.html and works.html
- **`srcDark`**: Dark logo (for light backgrounds) - used on about.html and contact.html

## Current Configuration

### Default Layout
```json
"logo": {
  "src": "assets/img/logo/dubaifilmmaker-light.svg",
  "srcDark": "assets/img/logo/dubaifilmmaker-dark.svg",
  "alt": "DubaiFilmMaker"
}
```

### Reversed Layout
```json
"logo": {
  "src": "assets/img/logo/dubaifilmmaker-original-light.svg",
  "srcDark": "assets/img/logo/dubaifilmmaker-original-dark.svg",
  "alt": "DubaiFilmMaker"
}
```

### Stacked Logo
```json
"logo": {
  "src": "assets/img/logo/dubaifilmmaker-light.svg",
  "srcDark": "assets/img/logo/dubaifilmmaker-dark.svg",
  "alt": "DubaiFilmMaker"
}
```

## How It Works

### Dark Background Pages (index.html, works.html)
- Use `presetConfig.logo.src` (light logo)
- Light logo shows well on dark backgrounds

### Light Background Pages (about.html, contact.html)
- Use `presetConfig.logo.srcDark` (dark logo)
- Dark logo shows well on light backgrounds
- Falls back to `src` if `srcDark` is not defined

## Implementation

The JavaScript in each HTML file automatically selects the correct logo:

```javascript
// Dark background pages (index.html, works.html)
logo.src = presetConfig.logo.src;

// Light background pages (about.html, contact.html)
logo.src = presetConfig.logo.srcDark || presetConfig.logo.src;
```

## Adding New Logos

To add a new logo variant:

1. Upload both light and dark versions to `assets/img/logo/`
2. Update `data/header.json` with both paths
3. The system will automatically use the correct version per page

## File Locations

- **Configuration**: `final_portfolio_website/data/header.json`
- **Light Logos**: `final_portfolio_website/assets/img/logo/*-light.svg`
- **Dark Logos**: `final_portfolio_website/assets/img/logo/*-dark.svg`
