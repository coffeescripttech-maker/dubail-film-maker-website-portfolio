# Projects Navigation Behavior Documentation

## Overview

This document explains the complete behavior of the `.projects-nav` component in the DubaiFilmMaker website, including when it appears, how filtering works, and the solutions implemented to maintain visibility during filtering.

## Component Structure

```html
<div class="projects-nav">
  <ul class="list list--cat">
    <li>
      <a href="#works" class="js-filter-cat is-active" data-cat="*">all</a>
    </li>
    <li>
      <a href="#works" class="js-filter-cat" data-cat="TVC">TVC</a>
    </li>
    <li>
      <a href="#works" class="js-filter-cat" data-cat="BRAND FILM">Brand Films</a>
    </li>
  </ul>
</div>
```

## Visibility Behavior

### Desktop Behavior
The projects navigation appears based on scroll position:

**Scroll Detection Logic (from build.min.js):**
```javascript
onScroll = (t) => {
    h.small
        ? t > this.$worksNav.offsetHeight + 100
            ? this.el.classList.add("on-works-section")
            : this.el.classList.remove("on-works-section")
        : t > this.projectsOffset.y
          ? this.el.classList.add("on-works-section")
          : this.el.classList.remove("on-works-section");
};
```

**Conditions:**
- **Desktop**: When `scrollY > projectsOffset.y` (top of projects section)
- **Mobile**: When `scrollY > worksNav.offsetHeight + 100`
- **CSS State**: Header gets `on-works-section` class when conditions are met

### Mobile Behavior
Navigation appears when:
- User clicks the menu button (`.btn--menu`)
- Header gets `header--open` class
- Full navigation overlay appears

**Toggle Logic:**
```javascript
onBtnMenuMobileClick = (t) => {
    t.preventDefault(),
    t.stopPropagation(),
    this.el.classList.contains("header--open")
        ? (this.el.classList.remove("header--open"), this.el.classList.add("header--closing"))
        : (this.el.classList.remove("header--closing"), this.el.classList.add("header--open"));
};
```

## Category Filtering System

### Filter Configuration
- **All Projects**: `data-cat="*"`
- **TVC**: `data-cat="TVC"`
- **Brand Films**: `data-cat="BRAND FILM"`

### Data Flow
1. **Database**: Projects have `classification` field
2. **API Response**: `dubaifilmmaker-cms/src/app/api/projects/route.ts`
   ```typescript
   classification: project.classification || '',
   ```
3. **Frontend Rendering**: `page-renderer.js` uses `project.classification`
   ```javascript
   data-cat="${project.classification}"
   ```

### Filtering Logic (index.html)
```javascript
// Category filtering - replicate build.min.js logic
window.addEventListener('projects-rendered', function() {
  const filterLinks = document.querySelectorAll('.js-filter-cat');
  const worksList = document.querySelector('.list--works');
  const header = document.querySelector('header.header');
  
  filterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const selectedCategory = this.getAttribute('data-cat');
      
      // Update active state on filter links
      filterLinks.forEach(l => l.classList.remove('is-active'));
      this.classList.add('is-active');
      
      // Get all work items and filter them
      const allWorks = worksList.querySelectorAll('.box--work');
      
      allWorks.forEach(work => {
        const workCategory = work.getAttribute('data-cat');
        
        // Case-insensitive comparison
        const matches = selectedCategory === '*' || 
                       (workCategory && workCategory.toLowerCase() === selectedCategory.toLowerCase());
        
        if (matches) {
          work.classList.remove('hidden');
        } else {
          work.classList.add('hidden');
        }
      });
      
      // Force header to stay visible during filtering
      if (header) {
        if (selectedCategory === '*') {
          header.classList.remove('filter-active');
        } else {
          header.classList.add('on-works-section', 'filter-active');
        }
      }
    });
  });
});
```

## The Filtering Visibility Problem

### Problem Description
When filtering to categories with few projects (e.g., "Brand Films" with only 1 project):
1. Projects section becomes shorter
2. Scroll position falls below threshold
3. `on-works-section` class gets removed
4. Projects navigation disappears
5. User cannot change filters anymore

### Root Cause
The scroll detection logic in `build.min.js` removes `on-works-section` when:
- **Desktop**: `scrollY <= projectsOffset.y`
- **Mobile**: `scrollY <= worksNav.offsetHeight + 100`

When projects are filtered and hidden, the visible content height decreases, causing the scroll position to fall below these thresholds.

## Solution Implementation

### 1. Filter State Tracking
Added `filter-active` class to track when specific filters are applied:

```javascript
if (selectedCategory === '*') {
  // "All" filter - let normal scroll behavior control visibility
  header.classList.remove('filter-active');
} else {
  // Specific filter active - force projects-nav to stay visible
  header.classList.add('on-works-section', 'filter-active');
}
```

### 2. CSS Override
Force projects-nav to stay visible when filtering is active:

```css
/* Force projects-nav to stay visible when filtering is active */
header.filter-active .projects-nav {
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
}

/* Ensure filter links remain visible and clickable when filter is active */
header.filter-active .header__navigations-wrapper {
  opacity: 1 !important;
  visibility: visible !important;
}
```

### 3. Scroll Override Protection
Prevent normal scroll behavior from hiding navigation during filtering:

```javascript
// Override scroll behavior to maintain projects-nav visibility during filtering
function preventScrollHide() {
  const header = document.querySelector('header.header');
  if (header && header.classList.contains('filter-active')) {
    // Force on-works-section to stay active during filtering
    if (!header.classList.contains('on-works-section')) {
      header.classList.add('on-works-section');
      console.log('✓ Maintained on-works-section during filtering');
    }
  }
}

// Add scroll listener to maintain filter visibility
window.addEventListener('scroll', preventScrollHide);
```

## Behavior States

### State 1: Normal Scroll Behavior
- **Condition**: No specific filter active (`data-cat="*"`)
- **Classes**: `header` (no filter-active)
- **Behavior**: Standard scroll-based visibility controlled by `build.min.js`

### State 2: Filter Active
- **Condition**: Specific filter selected (`data-cat="TVC"` or `data-cat="BRAND FILM"`)
- **Classes**: `header.filter-active.on-works-section`
- **Behavior**: Projects-nav forced visible regardless of scroll position

### State 3: Mobile Menu
- **Condition**: Menu button clicked
- **Classes**: `header.header--open`
- **Behavior**: Full navigation overlay visible

## Technical Implementation Files

### Key Files Modified
1. **index.html** - Main filtering logic and CSS overrides
2. **page-renderer.js** - Uses `project.classification` for `data-cat` attributes
3. **site-config.js** - Also updated to use `project.classification`

### Data Structure
```javascript
// API Response Structure
{
  id: 1,
  title: "Project Title",
  client: "Client Name",
  category: "Display Category",
  classification: "TVC", // Used for filtering
  // ... other fields
}
```

### CSS Classes Used
- `.js-filter-cat` - Filter link selector
- `.is-active` - Active filter state
- `.on-works-section` - Header state when projects section is active
- `.filter-active` - Custom class to maintain visibility during filtering
- `.hidden` - Hide filtered projects

## Testing Scenarios

### Scenario 1: Normal Operation
1. Load page → Projects-nav hidden initially
2. Scroll to projects → Projects-nav appears
3. Click "all" → All projects visible
4. Scroll up → Projects-nav disappears (normal behavior)

### Scenario 2: Filtering with Many Results
1. Click "TVC" → Multiple projects visible
2. Projects-nav stays visible
3. Can switch between filters
4. Click "all" → Returns to normal scroll behavior

### Scenario 3: Filtering with Few Results (Fixed)
1. Click "Brand Films" → Only 1 project visible
2. Projects-nav stays visible (forced by `filter-active`)
3. Can still click other filters
4. Click "all" → Returns to normal scroll behavior

## Console Logging
The implementation includes detailed console logging for debugging:

```javascript
console.log(`Filter clicked: ${selectedCategory}`);
console.log(`✓ Showing: ${projectTitle} (${workCategory})`);
console.log(`✗ Hiding: ${projectTitle} (${workCategory})`);
console.log('✓ Added filter-active class - projects-nav forced visible');
console.log('✓ Removed filter-active class - normal scroll behavior');
```

## Browser Compatibility
- **Modern Browsers**: Full functionality
- **CSS Support**: Uses `!important` overrides for reliable visibility
- **JavaScript**: ES6+ features, compatible with modern browsers

## Performance Considerations
- **Event Listeners**: Efficient event delegation
- **DOM Queries**: Cached selectors where possible
- **Scroll Events**: Throttled by browser's natural scroll handling
- **CSS Transitions**: Smooth state changes

## Maintenance Notes
- Filter categories are defined in HTML and must match database `classification` values
- Case-insensitive matching handles variations in data
- CSS `!important` rules ensure visibility overrides work reliably
- Console logging can be removed in production for performance

## Future Enhancements
1. **Animation**: Add smooth transitions between filter states
2. **URL State**: Preserve filter state in URL parameters
3. **Keyboard Navigation**: Add keyboard support for filter links
4. **Accessibility**: Enhance ARIA labels and screen reader support
5. **Performance**: Implement virtual scrolling for large project lists