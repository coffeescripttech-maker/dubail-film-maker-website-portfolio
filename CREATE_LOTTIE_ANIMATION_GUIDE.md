# How to Create Custom "DUBAIFILMMAKER" Lottie Animation

## Option 1: Using LottieFiles Creator (Easiest - Free)

1. **Go to LottieFiles Creator**
   - Visit: https://lottiefiles.com/creator
   - Sign up for a free account

2. **Create New Animation**
   - Click "Create New"
   - Choose "Start from Scratch"
   - Set canvas size: 1920x1080 (or 1000x1000 for square)

3. **Add Text**
   - Click "Text" tool (T icon)
   - Type: "DUBAIFILMMAKER"
   - Font: Monument Extended Bold (or similar bold sans-serif)
   - Color: White (#FFFFFF)
   - Size: Large (adjust to fit canvas)
   - Position: Center

4. **Animate the Text**
   - Select the text layer
   - Add keyframes for:
     - **Opacity**: 0 → 1 (fade in)
     - **Scale**: 0.8 → 1.0 (subtle zoom)
     - **Position**: Slight movement if desired
   
   - Timeline:
     - 0s: Opacity 0, Scale 0.8
     - 0.5s: Opacity 1, Scale 1.0
     - 2.5s: Hold (no change)
     - 3.0s: Ready to transition

5. **Export**
   - Click "Export"
   - Choose "Lottie JSON"
   - Download the file
   - Save as: `final_portfolio_website/assets/img/intro-animation.json`

## Option 2: Using Adobe After Effects (Professional)

1. **Install Bodymovin Plugin**
   - Download from: https://aescripts.com/bodymovin/
   - Install in After Effects

2. **Create Composition**
   - New Composition: 1920x1080, 30fps, 3 seconds
   - Background: Transparent

3. **Add Text**
   - Create text layer: "DUBAIFILMMAKER"
   - Font: Monument Extended Bold
   - Color: White
   - Center align

4. **Animate**
   - Add keyframes for:
     - Opacity: 0 → 100%
     - Scale: 80% → 100%
   - Add easing (Easy Ease)

5. **Export with Bodymovin**
   - Window → Extensions → Bodymovin
   - Select composition
   - Export as JSON
   - Save to: `assets/img/intro-animation.json`

## Option 3: Simple Letter-by-Letter Animation

For a Posterco-style letter reveal:

1. **In LottieFiles Creator:**
   - Add each letter as separate text layer
   - Animate each letter with slight delay:
     - D: 0.0s
     - U: 0.1s
     - B: 0.2s
     - A: 0.3s
     - I: 0.4s
     - (continue pattern)
   
2. **Animation per letter:**
   - Opacity: 0 → 1
   - Scale: 0.9 → 1.0
   - Duration: 0.2s per letter

## Current Temporary Solution

Until you create the custom Lottie file, the site will use Posterco's existing animation. To replace it:

1. Create your Lottie animation using one of the methods above
2. Save it as: `final_portfolio_website/assets/img/intro-animation.json`
3. The site will automatically use your new animation!

## Animation Specifications (Match Posterco)

- **Duration**: ~3 seconds
- **Easing**: Ease-out (cubic-bezier)
- **Scale**: Start at 1.24, end at 1.442 (handled by CSS)
- **Color**: White (#FFFFFF)
- **Background**: Transparent
- **Font**: Monument Extended Bold or similar
- **Letter spacing**: Tight (0.02em)

## Testing Your Animation

1. Replace `assets/img/intro-animation.json` with your file
2. Refresh the homepage
3. The animation should:
   - Play for ~3 seconds
   - Scale up smoothly
   - Then move upward to header position
   - Work on both desktop and mobile

## Resources

- LottieFiles: https://lottiefiles.com
- Lottie Documentation: https://airbnb.io/lottie/
- After Effects Bodymovin: https://aescripts.com/bodymovin/
- Free Lottie Animations: https://lottiefiles.com/featured

## Need Help?

If you need assistance creating the animation, you can:
1. Hire a motion designer on Fiverr/Upwork
2. Use a pre-made template and customize the text
3. Ask me to create a simple CSS-based alternative
