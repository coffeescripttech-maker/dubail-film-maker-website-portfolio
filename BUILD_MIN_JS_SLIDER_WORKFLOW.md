# build.min.js Slider Workflow Documentation

## Overview
The `build.min.js` file contains a `Home` class (internally called `Ne`) that manages the homepage slider functionality. Understanding this workflow is crucial for properly integrating our dynamic API-based slider.

## Key Components

### 1. Initialization (Constructor)
```javascript
// Selectors used by build.min.js
this.$el = document.querySelector('.box--home')
this.$videos = [...document.querySelectorAll('.js-main-video')]
this.$timeline = document.querySelector('.box--home__timeline>span')
this.$list = document.querySelector('.list--home')
this.$listItems = [...document.querySelectorAll('.js-change-video')]  // ← CRITICAL
this.$link = document.querySelector('.box--home__link')
this.$counter = document.querySelector('.box--home__info__counter')
this.$mobileArrowPrev = document.querySelector('.box--home__buttons-mobile .arrow-prev')
this.$mobileArrowNext = document.querySelector('.box--home__buttons-mobile .arrow-next')

// State variables
this.currentlyPlaying = 0
this.minPlaying = 0
this.maxPlaying = this.$listItems.length - 1  // ← Based on list items count
```

### 2. Event Binding
```javascript
// Video events
this.$videos.forEach(video => {
  video.addEventListener('timeupdate', this.onTimeUpdate)
  video.addEventListener('ended', this.onEnded)
})

// List item clicks
this.$listItems.forEach(item => {
  item.addEventListener('click', this.onItemClick)
  item.addEventListener('mouseenter', this.onItemEnter)
})

// Arrow buttons
this.$mobileArrowPrev.addEventListener('click', this.onPrevClick)
this.$mobileArrowNext.addEventListener('click', this.onNextClick)
```

### 3. Core Functions

#### `changeVideo(index)`
The main function that switches between videos:
```javascript
changeVideo = (index) => {
  const listItem = this.$listItems[index]
  
  // Reset timeline
  this.$timeline.style.width = "0"
  
  // Update active list item
  this.$list.querySelectorAll("li").forEach(li => {
    li.classList.remove("is-active")
  })
  listItem.parentElement.classList.add("is-active")
  
  // Update counter (1-based)
  this.$counter.querySelector("span").textContent = index + 1
  
  // Update link href
  this.$link.href = listItem.href
  this.$mobileViewProjectBtn.href = listItem.href
  
  // Update cursor text
  this.$link.setAttribute("data-cursor-text", "Open " + listItem.querySelector("h2").textContent)
  
  // Switch videos
  this.$videos.forEach((video, i) => {
    if (i === this.currentlyPlaying) {
      video.currentTime = 0
      video.play()
      video.classList.add("visible")
    } else {
      video.classList.remove("visible")
      video.pause()
    }
  })
  
  // Animate timeline
  this.$timeline.classList.add("is-animated")
}
```

#### `onPrevClick()`
```javascript
onPrevClick = () => {
  this.currentlyPlaying--
  if (this.currentlyPlaying < this.minPlaying) {
    this.currentlyPlaying = this.maxPlaying  // Loop to last
  }
  this.changeVideo(this.currentlyPlaying)
}
```

#### `onNextClick()`
```javascript
onNextClick = () => {
  this.currentlyPlaying++
  if (this.currentlyPlaying > this.maxPlaying) {
    this.currentlyPlaying = this.minPlaying  // Loop to first
  }
  this.changeVideo(this.currentlyPlaying)
}
```

#### `onEnded()`
Auto-advance to next video when current one ends:
```javascript
onEnded = () => {
  this.$timeline.classList.remove("is-animated")
  this.currentlyPlaying++
  if (this.currentlyPlaying > this.maxPlaying) {
    this.currentlyPlaying = this.minPlaying  // Loop to first
  }
  this.changeVideo(this.currentlyPlaying)
}
```

#### `onTimeUpdate()`
Updates timeline progress bar:
```javascript
onTimeUpdate = () => {
  let progress = (100 * this.$videos[this.currentlyPlaying].currentTime) / 
                 this.$videos[this.currentlyPlaying].duration
  if (isNaN(progress)) progress = 0
  this.$timeline.style.width = progress.toFixed(2) + "%"
}
```

#### `onItemClick(event)`
Handles clicking on list items:
```javascript
onItemClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  // Don't do anything if already active
  if (event.currentTarget.parentElement.classList.contains("is-active")) {
    return false
  }
  
  const index = this.$listItems.indexOf(event.currentTarget)
  this.currentlyPlaying = index
  this.changeVideo(index)
}
```

## Critical Requirements for Our Implementation

### 1. HTML Structure
build.min.js expects this exact structure:
```html
<div class="box box--home">
  <div class="box--home__info">
    <div class="box--home__info__counter"><span>1</span>/6</div>
    
    <ul class="list list--home">
      <!-- Each project needs a list item with .js-change-video link -->
      <li class="is-active">
        <a href="works/project.html" class="js-change-video">
          <h2>Project Title</h2>
          <p>Client</p>
          <p>Category</p>
        </a>
      </li>
      <!-- More list items... -->
    </ul>
    
    <div class="box--home__timeline">
      <span class="is-animated"></span>
    </div>
  </div>
  
  <a href="works/project.html" class="box--home__link">
    <div class="box--home__wrapper video-wrapper">
      <video class="js-main-video" src="video.mp4"></video>
    </div>
  </a>
  
  <div class="box--home__buttons-mobile">
    <a href="works/project.html" class="mobile-link">view project</a>
    <div class="arrows">
      <button class="arrow-prev">←</button>
      <button class="arrow-next">→</button>
    </div>
  </div>
</div>
```

### 2. Key Selectors
- `.js-change-video` - MUST be on the `<a>` tag inside each `<li>`
- `.js-main-video` - Video element(s)
- `.box--home__info__counter span` - Counter number
- `.box--home__link` - Main project link
- `.mobile-link` - Mobile view project button
- `.arrow-prev` / `.arrow-next` - Navigation arrows

### 3. Important Notes

**Multiple Videos vs Single Video:**
- build.min.js supports MULTIPLE video elements (one per project)
- It shows/hides them using `.visible` class
- Our current implementation uses a SINGLE video and changes its `src`
- This is simpler but means we need to handle video loading ourselves

**maxPlaying Calculation:**
- `maxPlaying = this.$listItems.length - 1`
- This is calculated ONCE during initialization
- If we add list items dynamically, build.min.js won't know about them
- **Solution:** We need to either:
  1. Generate all HTML BEFORE build.min.js loads
  2. OR manually update the Home instance after adding items

**Timeline Animation:**
- Automatically updates based on video `timeupdate` events
- Resets to 0 when changing videos
- Adds `.is-animated` class for CSS transitions

## Integration Strategy

### Option A: Pre-generate HTML (Current Approach)
✅ **RECOMMENDED** - This is what we're doing now
1. Fetch API data
2. Generate ALL list items before build.min.js initializes
3. build.min.js automatically picks up all items
4. Arrow navigation works out of the box

### Option B: Hook into build.min.js Instance
❌ More complex, not recommended
1. Let build.min.js initialize with hardcoded HTML
2. Access the Home instance: `window.a` or find in `ze` array
3. Manually update `maxPlaying` and re-bind events
4. More fragile, depends on internal implementation

## Current Implementation Status

Our current implementation (Option A) is CORRECT:
- ✅ Generates all list items dynamically before build.min.js loads
- ✅ Uses `.js-change-video` class on links
- ✅ Updates counter format to match (1/6, 2/6, etc.)
- ✅ Arrow buttons use correct classes
- ✅ Single video with dynamic `src` switching

**The only difference:**
- build.min.js expects multiple `<video>` elements (one per project)
- We use ONE video and change its `src` attribute
- This works fine, but we handle video loading ourselves

## Testing Checklist
- [ ] Counter shows correct format (1/6, 2/6, etc.)
- [ ] Clicking list items switches videos
- [ ] Arrow buttons navigate between projects
- [ ] Videos auto-play on switch
- [ ] Timeline animates during playback
- [ ] Auto-advance to next video when current ends
- [ ] Looping works (last → first, first → last)
- [ ] Mobile view project button updates href
- [ ] Cursor text updates on hover
