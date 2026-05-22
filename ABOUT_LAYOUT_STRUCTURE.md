# About Page Layout Structure

## HTML Structure (Rendered by page-renderer.js)

```
<div class="about-inner-wrapper">
  <div class="content-wrapper">
    <div class="about-content">
      
      ┌─────────────────────────────────────────────────────────────┐
      │ ROW 1: HEADER (Full Width)                                  │
      │ <div class="about-header">                                  │
      │   <h2>Ahmed Almusallam</h2>                                 │
      │   <h3>Founder & Creative Director</h3>                      │
      │ </div>                                                       │
      └─────────────────────────────────────────────────────────────┘
      
      ┌─────────────────────────────────────────────────────────────┐
      │ ROW 2: 4-COLUMN GRID                                        │
      │ <div class="about-row-2">                                   │
      │                                                              │
      │  ┌──────────┬──────────┬──────────┬──────────┐             │
      │  │ Column 1 │ Column 2 │ Column 3 │ Column 4 │             │
      │  │  Intro   │Biography │Achievemts│ Company  │             │
      │  │          │          │          │   Info   │             │
      │  │ Para 1   │ Para 2   │ Para 3   │ Company  │             │
      │  │ from bio │ from bio │ from bio │  Para 1  │             │
      │  └──────────┴──────────┴──────────┴──────────┘             │
      │                                                              │
      │ </div>                                                       │
      └─────────────────────────────────────────────────────────────┘
      
      ┌─────────────────────────────────────────────────────────────┐
      │ ROW 3: 50/50 SPLIT                                          │
      │ <div class="about-row-3">                                   │
      │                                                              │
      │  ┌─────────────────────┬─────────────────────┐             │
      │  │  Large Featured     │  2-Column Content   │             │
      │  │  Image (50%)        │  Grid (50%)         │             │
      │  │                     │                     │             │
      │  │  <div class=        │  <div class=        │             │
      │  │  "col-large-image"> │  "col-remaining-    │             │
      │  │                     │   content">         │             │
      │  │  [First image       │                     │             │
      │  │   from images       │  ┌────────┬────────┐│             │
      │  │   array]            │  │ Left   │ Right  ││             │
      │  │                     │  │ Col    │ Col    ││             │
      │  │                     │  │        │        ││             │
      │  │                     │  │ Para 4 │ Para 6 ││             │
      │  │                     │  │ (bio)  │ (bio)  ││             │
      │  │                     │  │        │        ││             │
      │  │                     │  │ Para 5 │ Para 7 ││             │
      │  │                     │  │ (bio)  │ (bio)  ││             │
      │  │                     │  │        │        ││             │
      │  │                     │  │Company │Company ││             │
      │  │                     │  │Para 2  │Para 3  ││             │
      │  │                     │  └────────┴────────┘│             │
      │  │                     │                     │             │
      │  │  </div>             │  </div>             │             │
      │  └─────────────────────┴─────────────────────┘             │
      │                                                              │
      │ </div>                                                       │
      └─────────────────────────────────────────────────────────────┘
      
    </div> <!-- .about-content -->
  </div> <!-- .content-wrapper -->
  
  ┌─────────────────────────────────────────────────────────────┐
  │ ROW 4: THUMBNAILS + BUTTON                                  │
  │ <div class="images-button-wrapper">                         │
  │                                                              │
  │  ┌──────────┬──────────┬──────────┬──────────┐             │
  │  │ Column 1 │ Column 2 │ Column 3 │ Column 4 │             │
  │  │          │          │          │          │             │
  │  │ [Images span columns 1-3]      │  Button  │             │
  │  │                                 │          │             │
  │  │ <div class="list--about-images">│ <button  │             │
  │  │   ┌────────┬────────┐           │  class=  │             │
  │  │   │ Image2 │ Image3 │           │  "btn-   │             │
  │  │   │        │        │           │  reel">  │             │
  │  │   │ Image4 │ Image5 │           │          │             │
  │  │   └────────┴────────┘           │  view    │             │
  │  │ </div>                          │  Dubai   │             │
  │  │                                 │  Film    │             │
  │  │                                 │  Maker   │             │
  │  │                                 │  reel    │             │
  │  │                                 │  2026    │             │
  │  │                                 │          │             │
  │  │                                 │ </button>│             │
  │  └─────────────────────────────────┴──────────┘             │
  │                                                              │
  │ </div>                                                       │
  └─────────────────────────────────────────────────────────────┘
  
</div> <!-- .about-inner-wrapper -->
```

## CSS Grid Configuration

### ROW 2 (4-Column Grid)
```css
.about-row-2 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}
```

### ROW 3 (50/50 Split with 2-Column Content)
```css
.about-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 50% / 50% */
  gap: 40px;
}

.col-remaining-content {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 columns */
  grid-template-rows: auto auto;
  gap: 30px;
  grid-auto-flow: column; /* Fill columns first, then rows */
}
```

### ROW 4 (Thumbnails + Button)
```css
.images-button-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: center;
}

.list--about-images {
  grid-column: 1 / 4; /* Spans columns 1-3 */
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2x2 grid */
  gap: 20px;
}

.btn-reel {
  grid-column: 4; /* Column 4 */
  justify-self: center; /* Center within column */
  width: fit-content;
}
```

## Content Flow

### Data Source (from API)
```javascript
pageData = {
  founder: {
    name: "Ahmed Almusallam",
    title: "Founder & Creative Director",
    bio: "Para1<br /><br />Para2<br /><br />Para3<br /><br />Para4<br /><br />Para5..."
  },
  content: {
    main_text: "CompanyPara1<br /><br />CompanyPara2<br /><br />CompanyPara3..."
  },
  images: [
    { url: "image1.jpg" }, // Used as large image in Row 3
    { url: "image2.jpg" }, // Thumbnail in Row 4
    { url: "image3.jpg" }, // Thumbnail in Row 4
    { url: "image4.jpg" }, // Thumbnail in Row 4
    { url: "image5.jpg" }  // Thumbnail in Row 4
  ]
}
```

### Paragraph Distribution

**ROW 2 (4 columns):**
- Column 1: `bioParagraphs[0]` (Para 1)
- Column 2: `bioParagraphs[1]` (Para 2)
- Column 3: `bioParagraphs[2]` (Para 3)
- Column 4: `companyParagraphs[0]` (Company Para 1)

**ROW 3 (2-column content grid):**
- Left column: `bioParagraphs[3]`, `bioParagraphs[4]`, `companyParagraphs[1]`
- Right column: `bioParagraphs[5]`, `bioParagraphs[6]`, `companyParagraphs[2]`

Flow direction: **Column-first** (fills left column top to bottom, then right column)

## Button Design

### Initial State
- Border: 3px solid black
- Border-radius: `0 8px 8px 0` (straight left, rounded right)
- No left border (open frame effect)
- Background: transparent
- Text: black

### Hover State (Animation Sequence)
1. Left border appears (frame closes) - 0.5s
2. Border-radius changes to `8px` (all corners rounded) - 0.5s
3. Background fills with black - 0.4s (delayed 0.3s)
4. Text/arrow turn white
5. Arrow slides right 4px

### Z-index Layers
- `::before` (border frame): z-index: 0
- `::after` (background fill): z-index: 0
- `.cta-text` and `svg`: z-index: 2


## Mobile Responsive Behavior

### Mobile (max-width: 767px)

```
┌─────────────────────────┐
│ ROW 1: HEADER           │
│ Name                    │
│ Title                   │
└─────────────────────────┘

┌─────────────────────────┐
│ ROW 2: SINGLE COLUMN    │
│                         │
│ ┌─────────────────────┐ │
│ │ Intro (Para 1)      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Biography (Para 2)  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Achievements (P3)   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Company Info (P1)   │ │
│ └─────────────────────┘ │
└─────────────────────────┘

┌─────────────────────────┐
│ ROW 3: STACKED          │
│                         │
│ ┌─────────────────────┐ │
│ │ Large Featured      │ │
│ │ Image               │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Para 4              │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Para 5              │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Para 6              │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Company Para 2      │ │
│ └─────────────────────┘ │
└─────────────────────────┘

┌─────────────────────────┐
│ ROW 4: STACKED          │
│                         │
│ ┌─────────────────────┐ │
│ │ Image 2             │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Image 3             │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Image 4             │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ [View Reel Button]  │ │
│ │   (centered)        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**CSS:** All sections use `flex-direction: column` to stack vertically

---

### Tablet (768px - 1023px)

```
┌───────────────────────────────────┐
│ ROW 1: HEADER                     │
│ Name + Title                      │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│ ROW 2: 2-COLUMN GRID              │
│                                   │
│  ┌──────────────┬──────────────┐  │
│  │ Intro        │ Biography    │  │
│  │ (Para 1)     │ (Para 2)     │  │
│  └──────────────┴──────────────┘  │
│                                   │
│  ┌──────────────┬──────────────┐  │
│  │ Achievements │ Company Info │  │
│  │ (Para 3)     │ (Para 1)     │  │
│  └──────────────┴──────────────┘  │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│ ROW 3: STACKED                    │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ Large Featured Image        │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌──────────────┬──────────────┐  │
│  │ Para 4       │ Para 5       │  │
│  └──────────────┴──────────────┘  │
│                                   │
│  ┌──────────────┬──────────────┐  │
│  │ Para 6       │ Company P2   │  │
│  └──────────────┴──────────────┘  │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│ ROW 4: STACKED                    │
│                                   │
│  ┌──────────────┬──────────────┐  │
│  │ Image 2      │ Image 3      │  │
│  └──────────────┴──────────────┘  │
│                                   │
│  ┌──────────────┬──────────────┐  │
│  │ Image 4      │ Image 5      │  │
│  └──────────────┴──────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │   [View Reel Button]        │  │
│  │      (centered)             │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

**CSS:** 
- ROW 2: `grid-template-columns: repeat(2, 1fr)`
- ROW 3: Large image stacked, content in 2 columns
- ROW 4: Images in 2x2 grid, button centered below

---

### Desktop (1024px+)

See main layout structure above (4-column magazine layout)

---

## Responsive Breakpoints Summary

| Breakpoint | ROW 1 | ROW 2 | ROW 3 | ROW 4 |
|------------|-------|-------|-------|-------|
| **Mobile** (≤767px) | Stacked | 1 column | Stacked | 1 column + button |
| **Tablet** (768-1023px) | Full width | 2x2 grid | Image + 2 cols | 2x2 grid + button |
| **Desktop** (≥1024px) | Full width | 4 columns | 50/50 split | 3 cols images + button |

## Key Responsive Features

1. **Fluid Typography**: Font sizes remain consistent (0.9rem) across all breakpoints
2. **Flexible Spacing**: Gaps reduce on smaller screens (30px → 25px → 20px)
3. **Smart Stacking**: Complex grids collapse to simpler layouts on mobile
4. **Button Centering**: Button always centered on mobile/tablet, centered in column 4 on desktop
5. **Image Optimization**: Images maintain aspect ratio and scale responsively
