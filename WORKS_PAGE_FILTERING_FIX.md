# Works Page Filtering Fix

## Problem
The filter links on the works page (TVC / Brand Films, Narrative Films) were not working. Clicking them did nothing - all projects remained visible.

## Root Cause
The filtering JavaScript logic was only implemented in `index.html` but was missing from `works.html`.

## Solution
Added the complete filtering system to `works.html`:

### 1. JavaScript Filtering Logic
Added event listeners to `.js-filter-cat` links that:
- Update active state on clicked filter
- Show/hide projects based on `data-cat` attribute matching
- Maintain projects-nav visibility during filtering
- Prevent scroll from hiding navigation when filter is active

### 2. CSS Styles
Added styles to support filtering:
```css
/* Hide filtered projects */
.box--work.hidden {
  display: none !important;
}

/* Keep navigation visible during filtering */
header.filter-active .projects-nav {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}
```

## How It Works

### Filter Categories
- **All** (`data-cat="*"`) - Shows all projects
- **TVC / Brand Films** (`data-cat="TVC"`) - Shows only TVC projects
- **Narrative Films** (`data-cat="narrative"`) - Shows only narrative projects

### Filtering Process
1. User clicks a filter link (e.g., "TVC / Brand Films")
2. JavaScript gets the `data-cat` value from the clicked link
3. Loops through all `.box--work` elements
4. Compares each project's `data-cat` attribute with selected filter
5. Shows matching projects, hides non-matching ones
6. Adds `filter-active` class to header to keep navigation visible

### Example
```html
<!-- Filter link -->
<a class="js-filter-cat" data-cat="TVC">TVC / Brand Films</a>

<!-- Project with matching category -->
<li class="box--work" data-cat="TVC">
  <!-- Will be shown when TVC filter is active -->
</li>

<!-- Project with different category -->
<li class="box--work" data-cat="narrative">
  <!-- Will be hidden when TVC filter is active -->
</li>
```

## Testing

1. Go to works page
2. Click "TVC / Brand Films" filter
3. Verify only TVC projects are shown
4. Click "Narrative Films" filter
5. Verify only narrative projects are shown
6. Click "all" filter
7. Verify all projects are shown

## Files Modified
- `final_portfolio_website/works.html` - Added filtering JavaScript and CSS

## Console Logging
The filtering system includes detailed console logging:
- `🔄 Initializing category filtering on works page...`
- `Filter clicked: TVC`
- `Filtering X projects by category: TVC`
- `✓ Showing: [Project Name] (TVC)`
- `✗ Hiding: [Project Name] (narrative)`
- `✓ Filtering complete`

Check browser console to debug filtering issues.

## Match with CMS
The filtering now works perfectly with the updated CMS classification system:
- CMS "TVC / Brand Films" → `classification: "TVC"` → Matches `data-cat="TVC"`
- CMS "Narrative Films" → `classification: "narrative"` → Matches `data-cat="narrative"`
