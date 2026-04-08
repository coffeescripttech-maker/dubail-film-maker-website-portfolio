# Video Launch Fix - Dynamic Content Issue

## Problem
`build.min.js` initializes the homepage slider (class `Ne`) immediately when the page loads, but at that time, the videos haven't been dynamically generated yet. So `build.min.js` can't find the `.js-main-video` elements and the `launch()` function doesn't work properly.

## Timeline
1. Page loads
2. build.min.js runs and looks for `.box--home` → finds it
3. build.min.js creates `Ne` class instance → calls `launch()`
4. `launch()` looks for `.js-main-video` → **DOESN'T FIND ANY** (not generated yet)
5. Later: Your inline script generates the videos dynamically
6. Videos exist now, but build.min.js already ran and won't run again

## Solution
After dynamically generating the videos, we need to manually call the video visibility logic that build.min.js would have called.

## Implementation
Add this code after videos are generated in the inline script.
