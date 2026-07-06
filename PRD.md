# Product Requirement Document (PRD): McLaren F1 Website Improvements

**Document Version:** 1.0.0  
**Date:** July 5, 2026  
**Status:** Under Review  
**Target Pages:** `fans.html`, `mclaren-plus.html`, `shop.html`, `team.html`  

---

## 1. Project Overview & Objectives

### 1.1 Context
The McLaren Racing F1 Project contains a solid, modern homepage (`index.html`) using TailwindCSS. However, the child pages (`fans.html`, `mclaren-plus.html`, `shop.html`, and `team.html`) are currently basic templates, lacking complete features, interactivity, and realistic content. 

### 1.2 Objective
Transform the placeholders on these child pages into a **fully functioning, highly interactive, and visually stunning web experience** that matches the high-octane branding of McLaren Racing. 

### 1.3 Key Experience Pillars
- **Aesthetic Wow-Factor:** Premium dark mode palettes, vibrant Papaya Orange (#FF8000) accents, sleek layout structures, clean typography (Anybody & Inter), and fluid micro-animations.
- **Rich Interactivity:** Users must be able to interact with features directly (e.g., voting in polls, playing a trivia quiz, adding items to a cart, view member profile cards, toggling accordions, and viewing stats overlays).
- **Persistent State:** Client-side states (membership registration, shopping cart items, poll votes) must persist using browser `localStorage` to simulate a real backend environment.
- **Uncompromised Responsiveness:** Flawless layout adaptions for mobile, tablet, and desktop viewports.

---

## 2. Page Specifications & Feature Requirements

### 2.1 Fans Page (`fans.html`)
The fans page acts as the hub for the "Papaya Army." It must feel alive, community-driven, and highly engaging.

#### Key Features:
1. **Interactive Fan Poll Widget:**
   - **Requirement:** A card displaying a current question (e.g., *"Who will win the next GP?"* or *"Favorite McLaren Livery of all time?"*).
   - **Interactivity:** Clickable options with hover states. On click, display animated progress bars with percentage distributions.
   - **Persistence:** Save user selection in `localStorage` to prevent duplicate voting. Indicate "Thank you for voting!" on return.
2. **"McLaren IQ" Mini Trivia Quiz:**
   - **Requirement:** An interactive 3-question quiz testing fan knowledge.
   - **Interactivity:** Multiple-choice format. Instantly show correct/incorrect status on submission with micro-animations. Show a final scorecard with a sharing option (text copy).
3. **Enhanced "Papaya Moments" Wall:**
   - **Requirement:** A grid representing community posts tagged with `#FansLikeNoOther`.
   - **Interactivity:** A responsive lightbox modal when a user clicks a photo. The modal displays a larger image, caption, author handle, and a "Like" button with state persistence.
4. **Digital Download Center:**
   - **Requirement:** A premium layout presenting downloadable wallpapers.
   - **Interactivity:** Select Resolution dropdown (Desktop / Mobile). Trigger a simulated file download with a progress bar indicator.

---

### 2.2 McLaren Plus Page (`mclaren-plus.html`)
This is the registration and dashboard portal for McLaren's official free fan program.

#### Key Features:
1. **Multi-Step Account Registration Form:**
   - **Requirement:** A modern, clean multi-step form (Step 1: Personal Details, Step 2: Account Security & Preferences).
   - **Interactivity:** Real-time form validations (email regex, password strength meter with color-coded bars, required checkboxes).
2. **Interactive Member Dashboard (Pre- & Post-Registration states):**
   - **Requirement:** If registered (checked via `localStorage`), the form is replaced by a personalized digital Member Card.
   - **Member Card Features:**
     - Sleek futuristic design (semi-transparent glassmorphism with reflective gradient highlights).
     - Displays: Member Name, Join Date, Unique Member ID (e.g., `#MCL-2026-XXXXX`), and Member QR Code (simulated).
     - A "Sign Out" button to reset the state back to the signup form.
3. **Benefits & FAQs Accordion Section:**
   - **Requirement:** Accordion list answering common membership questions.
   - **Interactivity:** Smooth toggle height animations with SVG chevron rotations.

---

### 2.3 Shop Page (`shop.html`)
An immersive merchandise showcase supporting full e-commerce flows up to the point of payment.

#### Key Features:
1. **Slide-Out Shopping Cart Drawer:**
   - **Requirement:** A slide-out panel that appears from the right side of the screen when clicking a cart icon in the navigation bar.
   - **Cart Interactivity:**
     - Lists all items added to the cart with product image, name, selected size, price, and quantity selector.
     - Supports modifying quantity (`+` and `-`) and deletion.
     - Live calculations of subtotal, estimated shipping, and final total.
     - Persist cart items in `localStorage` to preserve items across page reloads.
2. **Dynamic Search & Category Filtering:**
   - **Requirement:** Filter controls (All, Mens, Womens, Accessories) and a text search input.
   - **Interactivity:** JavaScript-based live filtering that updates the grid instantly with zero page reloads. Display a "No items found" message if searches yield empty results.
3. **Enhanced Product Cards & Quick View Modal:**
   - **Requirement:** Product cards display interactive hover states (e.g., sliding up "Add to Cart" panel, showing size selection chips).
   - **Quick View Modal:** Clicking a product opens a modal with a detailed product description, larger images, size selectors (S, M, L, XL), and an add-to-cart button.
4. **Checkout Simulation:**
   - **Requirement:** Clicking "Checkout" in the drawer shows a premium modal simulating checkout steps (Order Review -> Success).
   - **Interactivity:** Order success screen displays order confirmation details and empties the cart.

---

### 2.4 Team Page (`team.html`)
A deep dive into the personnel behind the racing team, detailing statistics and heritage.

#### Key Features:
1. **Driver Bio & Stat Sheet Modal:**
   - **Requirement:** Clicking on Lando Norris' or Oscar Piastri's driver cards opens an overlay displaying their career stats and biography.
   - **Stats Display:** Interactive charts or progressive stat bars showing: Wins, Podiums, Pole Positions, Fast Laps, and Career Points.
2. **Head-to-Head Driver Comparison Tool:**
   - **Requirement:** A side-by-side metric comparator between Lando and Oscar.
   - **Interactivity:** Visually highlight the leading driver for each metric using the Papaya Orange color code.
3. **Interactive Heritage Timeline:**
   - **Requirement:** A vertical timeline showcasing pivotal milestones in McLaren history (e.g., founder Bruce McLaren starting the team in 1963, first GP win in 1968, Ayrton Senna championships, 2026 Masterclass).
   - **Interactivity:** Scroll-activated highlight animations, or click-to-expand details for each era.

---

## 3. Design System & Tech Stack Constraints

### 3.1 Design Principles
- **Theme Consistency:** Keep layouts cohesive with the main site. Use a sticky navigation bar with the official McLaren logo and standard font classes.
- **Glassmorphism:** Apply backdrop filters (`backdrop-blur-md bg-white/10`) to modals and dashboard interfaces to give a premium, futuristic cockpit feel.
- **Typography:**
  - Headings: `Anybody, sans-serif` (Bold/Black)
  - Body: `Inter, sans-serif`
- **Color Codes:**
  - Primary (Papaya): `#FF8000` (Tailwind class: `bg-papaya`, `text-papaya`)
  - Dark: `#111111` (Tailwind class: `bg-dark`, `text-dark`)
  - Light Grey: `#F5F5F5` (Tailwind class: `bg-light`)
  - Accent/Success: `#00D28E` (McLaren electric green)

### 3.2 Tech Stack Limits
- **Libraries:** Only standard browser APIs (Vanilla JavaScript) and CDN-delivered TailwindCSS. External script tags (e.g., FontAwesome, Lucide-Icons, Google Fonts) are allowed.
- **Assets:** Use high-quality curated images from Unsplash or locally available files. Do not use plain text shapes for complex items.
- **Code Organization:** Keep scripts clean and organized, leveraging existing `js/main.js` and `css/style.css` where possible, or adding modular scripts for each feature.

---

## 4. Implementation Plan & Milestones

- **Phase 1: Setup & CSS Refactoring**
- **Phase 2: Page Upgrades (`fans.html`, `mclaren-plus.html`, `shop.html`, `team.html`)**
- **Phase 3: QA, LocalStorage Integration & Animations Polish**

---

## 5. Verification & Acceptance Criteria
- **State Check:** Registering on `mclaren-plus.html` must instantly unlock/change user states on the Fans and McLaren Plus page.
- **Cart Check:** Adding products on `shop.html` must increase the cart counter and update subtotal prices accurately in the slide-out drawer.
- **SEO Check:** Every page must include complete `<title>`, description metadata, and proper heading structures (`<h1>`).
- **Responsive Check:** All tables, forms, and timelines must fit smoothly on mobile screens (minimum viewport 375px width).
