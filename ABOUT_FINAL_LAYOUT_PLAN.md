# About Page - Final Magazine Layout Plan

## Target Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Ahmed Al Mutawa                                              │
│ FILM DIRECTOR / EXECUTIVE PRODUCER                           │
├──────────────────────────────────────────────────────────────┤
│ Col 1        │ Col 2           │ Col 3        │ Col 4        │
│ Intro        │ Biography       │ Achievements │ Company Info │
│ Emirati...   │ With proven...  │ Founder...   │ Located...   │
├──────────────┴─────────────────┴──────────────┴──────────────┤
│                                                                │
│ ┌────────────┐  Continuing text from company description...  │
│ │            │  Every project is a unique journey...          │
│ │   LARGE    │  We strive to assemble...                      │
│ │   IMAGE    │  Beyond production, we oversee...              │
│ │            │                                                 │
│ └────────────┘                                                 │
├──────────────────────────────────────────────────────────────┤
│ [Thumb 1]  [Thumb 2]  [Thumb 3]         [View Reel Button →] │
└──────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### HTML Structure (existing):
```html
<div class="about-inner-wrapper">
  <div class="content-wrapper">
    <div class="box box--about">
      <!-- All text content here -->
    </div>
  </div>
  <div class="images-button-wrapper">
    <div class="list list--about-images">
      <!-- Thumbnails here -->
    </div>
    <button class="btn-reel">View Reel</button>
  </div>
</div>
```

### JavaScript Changes:
1. Split bio into 4 parts (not 3):
   - Pillar 1: Intro (paragraph 1)
   - Pillar 2: Biography (paragraphs 2-3)
   - Pillar 3: Achievements (paragraph 4)
   - Pillar 4: Company start (paragraph 5)

2. Add featured image wrapper

3. Add remaining company text

### CSS Grid Layout:
```css
.box--about {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
  gap: 30px;
}

/* Name & Title: span all 4 columns */
h2, h3 { grid-column: 1 / 5; }

/* 4 text pillars: each takes 1 column */
.text-pillar:nth-of-type(1) { grid-column: 1; }
.text-pillar:nth-of-type(2) { grid-column: 2; }
.text-pillar:nth-of-type(3) { grid-column: 3; }
.text-pillar:nth-of-type(4) { grid-column: 4; }

/* Featured image: column 1, row 3 */
.featured-image-wrapper { 
  grid-column: 1; 
  grid-row: 3;
}

/* Company description: columns 2-4, row 3 */
.company-description { 
  grid-column: 2 / 5; 
  grid-row: 3;
}
```

### Bottom Section:
```css
.images-button-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.list--about-images {
  grid-column: 1 / 4; /* Spans 3 columns */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.btn-reel {
  grid-column: 4; /* Last column */
  justify-self: end;
}
```

## Content Mapping

From API data:
- **Intro**: `founder.bio` paragraph 1
- **Biography**: `founder.bio` paragraphs 2-3 combined
- **Achievements**: `founder.bio` paragraph 4
- **Company Info**: `founder.bio` paragraph 5
- **Large Image**: `images[0]`
- **Continuing Text**: `content.main_text` (all 3 paragraphs)
- **Thumbnails**: `images[1]` and `images[2]`

## Benefits

✅ Clean 4-column magazine layout
✅ Large featured image creates visual anchor
✅ Text flows naturally across columns
✅ Bottom gallery with prominent CTA button
✅ Responsive and professional
✅ No stat callouts (cleaner design)
