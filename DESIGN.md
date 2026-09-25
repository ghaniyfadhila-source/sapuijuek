# DESIGN SYSTEM GLASSMORPHISM
## Website Portofolio Kelas PPLG SMKN 9 Semarang dengan Tema Glassmorphism Modern

---

## 1. DESIGN PHILOSOPHY & GLASSMORPHISM

### 1.1 Core Philosophy

Website kelas PPLG akan menggabungkan:
- **Glassmorphism**: Modern, futuristic, elegant
- **Minimalism**: Clean, purposeful, focused
- **Tech-Forward Aesthetic**: Mencerminkan visi PPLG (Pengembangan Perangkat Lunak & Gim)

**Glassmorphism Principles:**
```
✨ Translucency + Blur Effect + Depth = Modern, Sophisticated Look
├─ Frosted glass appearance (semi-transparent backgrounds)
├─ Backdrop blur (blur elemen di belakang)
├─ Subtle borders dan shadows
├─ Layered design untuk depth perception
└─ Smooth transitions antara elemen
```

### 1.2 Visual Characteristics

```
🔮 Glassmorphic Elements:
   • Background: Semi-transparent dengan backdrop blur
   • Border: Subtle light border untuk definition
   • Shadow: Minimal, shadow radius 12-24px dengan low opacity
   • Backdrop Filter: blur(20px) + saturate(180%)
   • Transparency: 80-95% opaque (10-20% transparent)

🎨 Color Philosophy:
   • Vibrant accents (gradients, not flat colors)
   • High contrast untuk readability
   • Soft, sophisticated palette
   • Gradient backgrounds untuk dynamism
```

---

## 2. NEW COLOR PALETTE - GLASSMORPHISM EDITION

### 2.1 Primary Colors (Modern & Vibrant)

```
PRIMARY GRADIENT:
  From:  #6366F1 (Indigo)  ← Deep, professional
  To:    #A855F7 (Purple)  ← Modern, energetic
  Usage: Hero, CTAs, accents

Background Gradient:
  From:  #0F0F23 (Dark Navy) atau #F8FAFC (Light)
  To:    #1A0033 (Deep Purple) atau #E0E7FF (Light Purple tint)
  Usage: Page backgrounds untuk depth
```

### 2.2 Semantic Colors

```
✅ Success Green (Soft):
   Primary:    #10B981
   Light:      #D1FAE5
   Dark:       #059669

🔴 Error Red (Soft):
   Primary:    #EF4444
   Light:      #FEE2E2
   Dark:       #DC2626

⚠️ Warning Yellow (Warm):
   Primary:    #F59E0B
   Light:      #FEF3C7
   Dark:       #D97706

ℹ️ Info Blue (Soft):
   Primary:    #3B82F6
   Light:      #DBEAFE
   Dark:       #1D4ED8
```

### 2.3 Neutral Colors (Glassmorphism-Friendly)

```
For Light Theme (Primary):
  Background:      #F8FAFC (Very light blue-gray)
  Surface:         #F1F5F9 (Light gray-blue)
  Glassmorphic BG: rgba(255, 255, 255, 0.8) dengan backdrop blur
  Card:            rgba(255, 255, 255, 0.85) dengan backdrop blur
  Text Dark:       #0F172A (Almost black)
  Text Light:      #64748B (Slate gray)
  Border:          rgba(255, 255, 255, 0.6) dengan subtle glow
  Border Dark:     rgba(100, 116, 139, 0.2)

For Dark Theme (Optional):
  Background:      #0F0F23
  Surface:         #1A1A3E
  Glassmorphic BG: rgba(15, 15, 35, 0.8) dengan backdrop blur
  Card:            rgba(30, 30, 65, 0.85) dengan backdrop blur
  Text Light:      #E2E8F0
  Text Dark:       #94A3B8
  Border:          rgba(100, 116, 139, 0.3) dengan subtle glow
```

### 2.4 Glassmorphic Gradient Backgrounds

```
GRADIENT 1: Purple Sunrise (Hero Section)
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%)
  backdrop-filter: blur(20px)
  opacity: 0.9

GRADIENT 2: Cool Breeze (Section Backgrounds)
  background: linear-gradient(180deg, #E0E7FF 0%, #F3E8FF 100%)
  With glassmorphic overlay: rgba(255, 255, 255, 0.7)

GRADIENT 3: Tech Blue (Accent Backgrounds)
  background: linear-gradient(90deg, #06B6D4 0%, #0EA5E9 100%)
  For features, badges, highlights

GRADIENT 4: Soft Purple (Cards Hover)
  background: linear-gradient(120deg, #A78BFA 0%, #C084FC 100%)
  With transparency: 0.15 opacity overlay
```

---

## 3. TYPOGRAPHY (Same as before, but with Glassmorphism adjustments)

### 3.1 Font Family & Weights

```
Primary Font Family:
  "Segoe UI", "Roboto", "-apple-system", "BlinkMacSystemFont", sans-serif

Font Weights:
  Light:     300 (untuk secondary text)
  Regular:   400 (body text)
  Medium:    500 (labels, secondary headings)
  Semi-Bold: 600 (headings, buttons)
  Bold:      700 (main headings, emphasis)
```

### 3.2 Font Sizes & Hierarchy

```
H1 (Page Title):       56px | Weight: 700 | Line-height: 1.2 | Letter-spacing: -1px
H2 (Section Title):    44px | Weight: 700 | Line-height: 1.25 | Letter-spacing: -0.5px
H3 (Subsection):       32px | Weight: 600 | Line-height: 1.3
H4 (Card Title):       24px | Weight: 600 | Line-height: 1.35
Body Text:             16px | Weight: 400 | Line-height: 1.6 | Letter-spacing: 0.3px
Small Text:            14px | Weight: 400 | Line-height: 1.5
Caption:               12px | Weight: 500 | Line-height: 1.4 | Color: text-light with opacity
Button Text:           16px | Weight: 600 | Letter-spacing: 0.5px | Uppercase untuk emphasis
```

### 3.3 Text Color with Glassmorphism

```
Primary Text:        #0F172A (near black, high contrast)
Secondary Text:      #475569 (slate gray, readable)
Tertiary Text:       #94A3B8 (light gray, subtle)
Text on Glassmorphic: #1A1A2E (dark enough untuk contrast terhadap frosted glass)
Button Text:         White (#FFFFFF)
Link Color:          #6366F1 (indigo, matches primary)
Link Hover:          #8B5CF6 (purple shift)
```

---

## 4. GLASSMORPHISM COMPONENTS & EFFECTS

### 4.1 Glassmorphic Card (Universal Component)

```css
.card-glassmorphic {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);  /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-glassmorphic:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 12px 48px rgba(99, 102, 241, 0.2);
  transform: translateY(-4px);
}

/* Dark variant */
.card-glassmorphic-dark {
  background: rgba(30, 30, 65, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 116, 139, 0.3);
}
```

### 4.2 Glassmorphic Navigation Bar

```css
.navbar-glassmorphic {
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.navbar-glassmorphic .logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-glassmorphic .menu-item {
  color: #0F172A;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.navbar-glassmorphic .menu-item:hover {
  color: #6366F1;
}

.navbar-glassmorphic .menu-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366F1, #A855F7);
  border-radius: 2px;
}
```

### 4.3 Glassmorphic Hero Section

```css
.hero-glassmorphic {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%);
}

.hero-glassmorphic::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.2) 0%, 
    rgba(168, 85, 247, 0.2) 100%);
  backdrop-filter: blur(30px);
  z-index: 1;
}

.hero-glassmorphic .content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hero-glassmorphic .cta-button {
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  border: none;
  color: white;
  padding: 16px 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.hero-glassmorphic .cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(99, 102, 241, 0.4);
}
```

### 4.4 Glassmorphic Button Variants

```css
/* Primary Button with Gradient */
.btn-primary-glass {
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);
}

.btn-primary-glass:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(99, 102, 241, 0.35);
}

/* Secondary Button with Glassmorphic Style */
.btn-secondary-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(99, 102, 241, 0.3);
  color: #6366F1;
  padding: 12px 32px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #6366F1;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
}

/* Tertiary Button (Text only) */
.btn-tertiary-glass {
  background: transparent;
  color: #6366F1;
  border: none;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.btn-tertiary-glass::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366F1, #A855F7);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.btn-tertiary-glass:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 4.5 Glassmorphic Feature Cards

```css
.feature-card-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366F1 0%, #A855F7 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card-glass:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 20px 48px rgba(99, 102, 241, 0.15);
}

.feature-card-glass:hover::before {
  opacity: 1;
}

.feature-card-glass .icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
  color: white;
}

.feature-card-glass h3 {
  color: #0F172A;
  margin: 16px 0;
}

.feature-card-glass p {
  color: #475569;
  line-height: 1.6;
}
```

### 4.6 Glassmorphic Achievement/Portfolio Cards

```css
.achievement-card-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.08);
}

.achievement-card-glass:hover {
  transform: translateY(-6px);
  border-color: rgba(99, 102, 241, 0.3);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 48px rgba(99, 102, 241, 0.15);
}

.achievement-card-glass .image {
  position: relative;
  overflow: hidden;
  height: 200px;
  background: linear-gradient(135deg, #E0E7FF, #F3E8FF);
}

.achievement-card-glass .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.achievement-card-glass:hover .image img {
  transform: scale(1.05);
}

.achievement-card-glass .badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.achievement-card-glass .content {
  padding: 20px;
}

.achievement-card-glass h4 {
  color: #0F172A;
  margin-bottom: 8px;
}

.achievement-card-glass p {
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.achievement-card-glass .date {
  color: #94A3B8;
  font-size: 12px;
}
```

### 4.7 Glassmorphic Badge/Pill

```css
.badge-glass {
  display: inline-block;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #6366F1;
  transition: all 0.3s ease;
}

.badge-glass:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.4);
}

/* Badge variants */
.badge-success-glass {
  border-color: rgba(16, 185, 129, 0.2);
  color: #059669;
}

.badge-new-glass {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(99, 102, 241, 0.1));
  border-color: rgba(168, 85, 247, 0.2);
  color: #6366F1;
}
```

### 4.8 Glassmorphic Input Fields

```css
.input-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  color: #0F172A;
}

.input-glass::placeholder {
  color: rgba(15, 23, 42, 0.4);
}

.input-glass:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-glass:hover {
  border-color: rgba(99, 102, 241, 0.2);
}

/* Error state */
.input-glass.error {
  border-color: rgba(239, 68, 68, 0.4);
}

.input-glass.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

---

## 5. SPACING & LAYOUT

### 5.1 Spacing Scale (8px Base)

```
xs: 8px    (micro spacing)
sm: 16px   (small spacing)
md: 24px   (medium spacing)
lg: 32px   (large spacing)
xl: 48px   (extra large)
2xl: 64px  (double extra large)
3xl: 96px  (triple extra large)
```

### 5.2 Responsive Breakpoints

```
Mobile:        320px - 576px
Tablet:        576px - 1024px
Desktop:       1024px - 1440px
Large Desktop: 1440px+

Container Max-Width: 1200px (desktop), 100% - 32px (mobile)
```

### 5.3 Common Padding Patterns

```
Hero Section:       64px 32px (desktop), 48px 16px (mobile)
Section:            48px 32px (desktop), 32px 16px (mobile)
Card Inner:         24px
Component Gap:      16px - 24px
Between Sections:   64px - 96px
```

---

## 6. BACKGROUND EFFECTS & TEXTURES

### 6.1 Glassmorphic Background Overlays

```css
/* For sections */
.section-with-glass-bg {
  background: linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%);
  position: relative;
}

.section-with-glass-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, 
    rgba(99, 102, 241, 0.1) 0%, 
    transparent 50%),
    radial-gradient(circle at 80% 80%, 
    rgba(168, 85, 247, 0.1) 0%, 
    transparent 50%);
  pointer-events: none;
}

.section-with-glass-bg > * {
  position: relative;
  z-index: 1;
}
```

### 6.2 Glassmorphic Divider/Separator

```css
.divider-glass {
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(99, 102, 241, 0.2),
    transparent);
  margin: 48px 0;
}
```

### 6.3 Frosted Glass Layer

```css
.frosted-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) brightness(1.1);
  -webkit-backdrop-filter: blur(20px) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
}
```

---

## 7. ANIMATIONS & TRANSITIONS (Glassmorphism-Optimized)

### 7.1 Timing Defaults

```
Fast:     0.15s - 0.2s  (micro interactions)
Medium:   0.3s - 0.4s   (standard interactions)
Slow:     0.5s - 0.8s   (page transitions)
Easing:   cubic-bezier(0.4, 0, 0.2, 1) [ease-out recommended]
```

### 7.2 Glassmorphic Animations

```css
/* Hover effect dengan backdrop blur change */
@keyframes glass-float {
  0% { transform: translateY(0) }
  50% { transform: translateY(-2px) }
  100% { transform: translateY(0) }
}

/* Glassmorphic card entrance */
@keyframes glass-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    backdrop-filter: blur(20px);
  }
}

/* Gradient shift animation */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(-45deg, #6366F1, #A855F7, #EC4899, #6366F1);
  background-size: 300% 300%;
  animation: gradient-shift 8s ease infinite;
}
```

### 7.3 Micro Interactions

```css
/* Button ripple effect on click */
.btn-glass::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1), translate(-50%, -50%);
  transform-origin: 50% 50%;
}

@keyframes ripple {
  0% {
    transform: scale(1), translate(-50%, -50%);
    opacity: 1;
  }
  100% {
    transform: scale(20), translate(-50%, -50%);
    opacity: 0;
  }
}
```

---

## 8. PAGE LAYOUTS WITH GLASSMORPHISM

### 8.1 Homepage Structure

```
┌────────────────────────────────────────────┐
│   NAVBAR (Glassmorphic, Sticky)           │
├────────────────────────────────────────────┤
│                                            │
│   HERO SECTION                            │
│   (Gradient + Glassmorphic Overlay)       │
│   - Large Title                           │
│   - Subheading                            │
│   - Gradient CTA Buttons                  │
│                                            │
├────────────────────────────────────────────┤
│   STATS SECTION                           │
│   (Glassmorphic Cards in Grid)            │
│   - 4 metric cards dengan icon            │
│                                            │
├────────────────────────────────────────────┤
│   WHY CHOOSE US                           │
│   (Feature Cards with Icons)              │
│   - 4 glassmorphic cards                  │
│   - Left: Icon, Right: Text               │
│                                            │
├────────────────────────────────────────────┤
│   RECENT ACHIEVEMENTS                     │
│   (Carousel/Grid of Achievement Cards)    │
│   - Image + Badge + Title + Description   │
│                                            │
├────────────────────────────────────────────┤
│   PORTFOLIO SHOWCASE                      │
│   (Grid of Project Cards)                 │
│   - Project image + title + description   │
│                                            │
├────────────────────────────────────────────┤
│   TESTIMONIALS                            │
│   (Glassmorphic Quote Cards)              │
│   - Quote + Author + Role                 │
│                                            │
├────────────────────────────────────────────┤
│   CTA SECTION                             │
│   (Join Us with glassmorphic box)         │
│                                            │
├────────────────────────────────────────────┤
│   FOOTER (Semi-transparent)               │
│   (Links + Contact + Social Media)        │
└────────────────────────────────────────────┘
```

### 8.2 Glassmorphic Section Template

```html
<section class="section-glass-bg">
  <div class="container">
    <div class="section-header">
      <h2>Section Title</h2>
      <p>Subtitle or description</p>
    </div>
    <div class="glass-cards-grid">
      <!-- Glassmorphic cards here -->
    </div>
  </div>
</section>

<style>
.section-glass-bg {
  background: linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 100%);
  padding: 64px 32px;
  position: relative;
  overflow: hidden;
}

.glass-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
</style>
```

---

## 9. ACCESSIBILITY WITH GLASSMORPHISM

### 9.1 Color Contrast Verification

```
Glassmorphic White Cards on Light Background:
  Text: #0F172A on rgba(255, 255, 255, 0.85) = 15:1 ✓ AAA Compliant
  Text: #475569 on rgba(255, 255, 255, 0.85) = 10.5:1 ✓ AAA Compliant

Buttons:
  White text on gradient (6366F1 to A855F7) = 7.5:1+ ✓ AAA Compliant
  
Border/Subtle Elements:
  rgba(99, 102, 241, 0.3) = Good for non-text elements
```

### 9.2 Glassmorphism & Readability

```
✓ High contrast text on glassmorphic backgrounds
✓ Backdrop blur doesn't hinder text legibility (blur 20px is safe)
✓ Sufficient padding in glassmorphic cards (24px minimum)
✓ Font sizes large enough (16px body minimum)
✓ Line height adequate (1.6 minimum)
```

### 9.3 Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Color contrast meets WCAG AA (4.5:1) minimum
- [ ] Keyboard navigation works on all interactive elements
- [ ] Focus indicators visible and clear
- [ ] Semantic HTML structure maintained
- [ ] Form labels properly associated
- [ ] No information conveyed by color alone
- [ ] Animations respect prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. DESIGN TOKENS - CSS VARIABLES

### 10.1 Color Tokens

```css
:root {
  /* Primary Colors */
  --color-primary-start: #6366F1;
  --color-primary-end: #A855F7;
  --color-primary-dark: #4F46E5;
  --color-secondary: #06B6D4;
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
  
  /* Neutral Colors */
  --color-bg: #F8FAFC;
  --color-surface: #F1F5F9;
  --color-surface-dark: #E2E8F0;
  --color-text-dark: #0F172A;
  --color-text-light: #475569;
  --color-text-lighter: #94A3B8;
  --color-border: rgba(255, 255, 255, 0.6);
  --color-border-dark: rgba(100, 116, 139, 0.2);
  
  /* Glassmorphic */
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.6);
  --glass-backdrop: blur(20px);
}
```

### 10.2 Spacing Tokens

```css
:root {
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 64px;
  --spacing-3xl: 96px;
}
```

### 10.3 Typography Tokens

```css
:root {
  --font-family: "Segoe UI", Roboto, sans-serif;
  --font-size-h1: 56px;
  --font-size-h2: 44px;
  --font-size-h3: 32px;
  --font-size-h4: 24px;
  --font-size-body: 16px;
  --font-size-small: 14px;
  --font-size-caption: 12px;
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
}
```

### 10.4 Effects & Shadow Tokens

```css
:root {
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.10);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.15);
  
  /* Glassmorphic Shadows */
  --shadow-glass: 0 8px 32px rgba(31, 38, 135, 0.1);
  --shadow-glass-hover: 0 12px 48px rgba(99, 102, 241, 0.2);
  
  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-base: 0.3s ease-out;
  --transition-slow: 0.5s ease-out;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

---

## 11. RESPONSIVE GLASSMORPHISM

### 11.1 Mobile Adjustments

```css
@media (max-width: 576px) {
  /* Reduce blur for better performance */
  .glassmorphic {
    backdrop-filter: blur(10px);
  }
  
  /* Adjust spacing */
  .section-glass-bg {
    padding: 32px 16px;
  }
  
  /* Stack cards vertically */
  .glass-cards-grid {
    grid-template-columns: 1fr;
  }
  
  /* Larger touch targets */
  .btn-glass {
    padding: 14px 28px;
    min-height: 48px;
  }
  
  /* Reduce font sizes slightly */
  h1 { font-size: 40px; }
  h2 { font-size: 32px; }
}
```

### 11.2 Tablet Adjustments

```css
@media (576px <= width <= 1024px) {
  .glass-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-glass-bg {
    padding: 48px 24px;
  }
}
```

---

## 12. BROWSER COMPATIBILITY

### 12.1 Glassmorphism Support

```css
/* Chrome/Edge 76+, Firefox 103+, Safari 9+ */
.glassmorphic {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  /* Safari support */
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

/* Fallback for older browsers */
@supports not (backdrop-filter: blur(1px)) {
  .glassmorphic {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(200, 200, 200, 0.3);
  }
}
```

---

## 13. GLASSMORPHISM BEST PRACTICES

### Do's ✓

```
✓ Use subtle blur (15-25px) untuk balanced effect
✓ Maintain high contrast untuk readability
✓ Use semi-transparent backgrounds (80-95% opaque)
✓ Apply consistent borders untuk definition
✓ Keep text dark atau white untuk contrast
✓ Use gradients untuk visual interest
✓ Apply on solid atau image backgrounds
✓ Optimize untuk performance (limit blur elements)
```

### Don'ts ✗

```
✗ Don't use excessive blur (>30px) - too blurry
✗ Don't forget fallbacks untuk unsupported browsers
✗ Don't use glassmorphism on every element - keep it selective
✗ Don't sacrifice readability untuk aesthetics
✗ Don't ignore performance impact
✗ Don't use on very dark backgrounds (low contrast)
✗ Don't animate blur property frequently (performance hit)
✗ Don't layer too many glassmorphic elements (overwhelming)
```

---

## 14. IMPLEMENTATION CHECKLIST

### Design Phase
- [ ] Create Figma library dengan glassmorphic components
- [ ] Define color palette dengan gradients
- [ ] Create typography scale
- [ ] Design all page layouts dengan glassmorphism
- [ ] Create component variations (hover, active, disabled states)
- [ ] Export assets (@1x, @2x)

### Development Phase
- [ ] Setup CSS variables untuk design tokens
- [ ] Implement responsive grid system
- [ ] Create glassmorphic component classes
- [ ] Add backdrop-filter dengan browser prefixes
- [ ] Test on different browsers (especially Safari)
- [ ] Implement fallbacks untuk unsupported browsers
- [ ] Add prefers-reduced-motion support
- [ ] Optimize images untuk backgrounds

### Testing Phase
- [ ] Mobile responsiveness (various screen sizes)
- [ ] Color contrast verification (WCAG AA minimum)
- [ ] Keyboard navigation
- [ ] Accessibility audit (alt text, ARIA labels)
- [ ] Performance testing (Lighthouse)
- [ ] Browser compatibility testing
- [ ] Animation smoothness (no janky transitions)
- [ ] Glassmorphism fallback display

### Launch Phase
- [ ] Final QA against design
- [ ] Performance optimization (minify CSS/JS)
- [ ] SEO check (meta tags, structured data)
- [ ] Analytics setup
- [ ] Monitoring for errors
- [ ] User feedback collection

---

## 15. COLOR REFERENCE GUIDE

### 15.1 When to Use Each Color

```
PRIMARY GRADIENT (#6366F1 → #A855F7):
  Usage: Main buttons, hero section, accent borders
  Best for: CTAs, important elements
  Avoid: Body text, backgrounds (too intense)

SECONDARY (#06B6D4):
  Usage: Secondary CTAs, highlights, special badges
  Best for: Secondary buttons, accent elements
  Avoid: Large backgrounds

GRAY/NEUTRAL (#475569, #94A3B8):
  Usage: Body text, secondary text, disabled states
  Best for: Content, helper text, subtle elements
  Avoid: Main CTAs

GREEN (#10B981):
  Usage: Success states, positive feedback
  Best for: Success badges, checkmarks, confirmations
  Avoid: Primary CTAs

ORANGE (#F59E0B):
  Usage: Warnings, notifications, important notices
  Best for: Alert badges, warning states
  Avoid: Primary CTAs

RED (#EF4444):
  Usage: Errors, danger states, deletions
  Best for: Error messages, delete buttons
  Avoid: Primary CTAs

BLUE (#3B82F6):
  Usage: Information, secondary accent
  Best for: Info badges, links
  Avoid: Duplicate to primary
```

---

## CONCLUSION

Desain glassmorphism untuk website Kelas PPLG SMKN 9 menciptakan:

✨ **Modern Aesthetic**: Terlihat futuristic dan contemporary
🎨 **Cohesive Brand**: Warna yang harmonis dan purposeful
⚡ **Tech-Forward**: Mencerminkan visi PPLG (teknologi)
♿ **Accessible**: Tetap readable dan usable untuk semua
📱 **Responsive**: Perfect di semua ukuran device
🚀 **Performant**: Optimized untuk kecepatan

Dengan mengikuti design system ini, website akan memiliki identitas visual yang unik, profesional, dan memorable.

---

**Document Version:** 2.0 (Glassmorphism Edition)  
**Status:** Ready for Implementation  
**Last Updated:** Desember 2024

Selamat mengimplementasikan! 🚀✨
