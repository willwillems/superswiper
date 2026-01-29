# SuperSwiper - UI Redesign Requirements

## Overview

Transform SuperSwiper from a functional decluttering tool into a **fun, playful, and engaging** experience inspired by Tinder's visual language. This redesign focuses on vibrant gradients, satisfying interactions, and a new XP system to gamify the decluttering process.

### Design Principles

- **Fun & Playful**: Every interaction should feel satisfying and game-like
- **Vibrant**: Bold gradients on cards/elements against clean dark/light backgrounds
- **Rewarding**: XP system provides constant positive feedback
- **Familiar**: Tinder-inspired patterns reduce learning curve

---

## Phase 1: Foundation & Global Styling

### Color System

- [ ] Add gradient CSS custom properties for semantic colors
  - `--gradient-keep`: green gradient (emerald → light emerald)
  - `--gradient-discard`: rose gradient (rose → light rose)
  - `--gradient-accent`: violet gradient
  - `--gradient-undo`: amber/yellow gradient
- [ ] Add card overlay gradient for text legibility
- [ ] Ensure all gradients work on both dark and light backgrounds
- [ ] Keep backgrounds clean and simple (dark: gray-900, light: gray-50)

### ActionButton Component

- [ ] Create `ActionButton.vue` reusable component
- [ ] Support variants: `keep`, `discard`, `undo`
- [ ] Support sizes: `sm` (40px), `md` (56px), `lg` (64px)
- [ ] Circular shape with gradient or solid background
- [ ] White icon centered inside
- [ ] Shadow for visual depth
- [ ] Press animation: `scale(0.9)` on active
- [ ] Disabled state: 50% opacity, no shadow

### Header Branding

- [ ] Create playful "SuperSwiper" logo treatment
- [ ] Consider gradient text or custom styling
- [ ] Keep compact to accommodate XP counter
- [ ] Maintain theme toggle and logout functionality

---

## Phase 2: XP System

### XP Store

- [ ] Create `xpStore.ts` for XP state management
- [ ] Track total XP points
- [ ] Track XP history (amount, action type, timestamp)
- [ ] Persist to localStorage with key `superswiper-xp`
- [ ] Define point values:
  - Keep: +5 XP
  - Discard (any category): +5 XP
  - Undo: 0 XP (no penalty)

### XP Header Display

- [ ] Add XP counter to right side of header
- [ ] Display lightning bolt or star icon
- [ ] Show current XP total
- [ ] Style with accent color or gradient text
- [ ] Use `font-semibold` and `text-sm`

### XP Popup Feedback

- [ ] Create `XpPopup.vue` component
- [ ] Trigger after each keep/discard action
- [ ] Show "+5 XP" text
- [ ] Float upward ~50px over 600ms
- [ ] Fade out during animation
- [ ] Green color for keep, rose for discard
- [ ] Position above the swiped card

### XP Milestones

- [ ] Trigger confetti at every 100 XP
- [ ] Consider larger celebration at 500 XP milestones

---

## Phase 3: Swipe Card Redesign

### SwipeCard Layout

- [ ] Photo fills entire card (object-cover)
- [ ] Rounded corners: `rounded-3xl` (24px)
- [ ] Bottom gradient overlay (transparent → dark)
- [ ] Name in bold white at bottom-left
- [ ] Optional subtitle line below name
- [ ] Remove category badge from card face
- [ ] Maintain ~3:4 aspect ratio

### Card Stack Visual

- [ ] More pronounced depth effect for stacked cards
- [ ] Background cards: scaled down, translated up
- [ ] Subtle shadow on foreground card
- [ ] Smooth transitions when advancing cards

### Swipe Feedback

- [ ] Keep existing gesture system
- [ ] Add subtle rotation based on drag direction
- [ ] Color tint overlay showing intent:
  - Green tint when dragging right (keep)
  - Rose tint when dragging left (discard)

---

## Phase 4: Action Buttons Redesign

### Button Row Layout

- [ ] Three buttons: Undo, Discard, Keep
- [ ] Centered below card stack
- [ ] Gap of `gap-6` between buttons
- [ ] Generous vertical spacing from cards

### Button Specifications

| Button  | Color        | Size | Icon               |
| ------- | ------------ | ---- | ------------------ |
| Undo    | Amber/Yellow | 48px | Arrow rotate left  |
| Discard | Rose/Red     | 64px | X mark             |
| Keep    | Green        | 64px | Heart or checkmark |

### Button Behavior

- [ ] Undo: Go to previous item (if available)
- [ ] Discard: Open discard sheet
- [ ] Keep: Open box picker sheet
- [ ] Disable Undo when no previous item
- [ ] Satisfying press feedback on all buttons

---

## Phase 5: Bottom Navigation Redesign

### Navigation Layout

- [ ] Vertical layout: icon above label
- [ ] Four tabs: Swipe, Add, Items, Stats
- [ ] Consistent spacing between tabs

### Active State

- [ ] Colored icon (accent color)
- [ ] Colored label text
- [ ] Optional underline indicator
- [ ] Smooth color transition

### Inactive State

- [ ] Muted gray icon
- [ ] Muted gray label
- [ ] Subtle tap feedback (scale animation)

### Icons

- [ ] Swipe: Flame or cards icon
- [ ] Add: Plus or camera icon
- [ ] Items: Box or grid icon
- [ ] Stats: Chart or trophy icon

---

## Phase 6: Sheets & Modals

### Discard Sheet

- [ ] Keep bottom sheet pattern
- [ ] Update button styling to match ActionButton
- [ ] Colorful icons for each option:
  - Trash: Gray/neutral with bin emoji
  - Donate: Orange/coral with gift emoji
  - Sell: Green/teal with money emoji
- [ ] Larger touch targets (min 56px height)
- [ ] Rounded button style

### Box Picker Sheet

- [ ] Keep existing gradient box cards
- [ ] Increase card size for easier tapping
- [ ] Add subtle shadow for depth
- [ ] "Create new box" with dashed border + plus icon
- [ ] Checkmark indicator on selected box (if applicable)

### Create Box Modal

- [ ] Match new visual language
- [ ] Rounded input field
- [ ] Primary button with gradient
- [ ] Clean, focused layout

---

## Phase 7: Add Page

### Layout

- [ ] Two large action buttons stacked vertically
- [ ] Camera button with camera icon
- [ ] Upload button with photo/gallery icon
- [ ] Instructional text with friendly tone

### Button Styling

- [ ] Large, tappable buttons (full width or near full)
- [ ] Rounded rectangle or circular style
- [ ] Subtle gradient or accent color
- [ ] Icon + label format

### Empty/Error States

- [ ] Friendly message when camera not available
- [ ] Upload progress feedback

---

## Phase 8: Items Page

### Section Headers

- [ ] Playful typography for "Boxes" and "Discarded"
- [ ] Consistent styling with rest of app

### Box Cards

- [ ] Keep existing gradient system
- [ ] Ensure vibrant colors
- [ ] Show box name and item count
- [ ] Tap to navigate to detail

### Discard Categories

- [ ] Row layout with icon, label, and count
- [ ] Colored icons matching discard sheet:
  - Trash: 🗑️
  - Donate: 🎁
  - Sell: 💰
- [ ] Tap to navigate to detail

### Empty States

- [ ] Friendly message when no boxes
- [ ] "Create your first box" CTA

---

## Phase 9: Items Detail Page

### Header

- [ ] Back button
- [ ] Box/category name
- [ ] Item count

### Grid Layout

- [ ] Square thumbnail cards
- [ ] 2 or 3 column grid
- [ ] Item name overlay on thumbnail

### Item Modal

- [ ] Full-size photo
- [ ] Editable name field
- [ ] Move to action with new button styling
- [ ] Delete option (styled appropriately)

---

## Phase 10: Stats Page

### XP Display

- [ ] Prominent XP total at top
- [ ] Lightning bolt or star icon
- [ ] Large, eye-catching number
- [ ] Optional: Level indicator (stretch goal)

### Progress Section

- [ ] Progress bar with gradient fill
- [ ] Percentage and counts displayed
- [ ] "X of Y items sorted" text

### Category Breakdown

- [ ] Visual breakdown by category
- [ ] Colored indicators matching category colors:
  - Kept: Green
  - Trash: Gray
  - Donate: Orange
  - Sell: Teal
- [ ] Item counts per category

### Empty State

- [ ] Friendly message when no items
- [ ] "Start sorting!" CTA

---

## Phase 11: Auth Page

### Branding

- [ ] Playful SuperSwiper header/logo
- [ ] Welcoming layout

### Form Styling

- [ ] Rounded input fields
- [ ] Primary button with gradient or accent
- [ ] Friendly, encouraging copy
- [ ] Clear error messages

### Guest Mode

- [ ] "Continue as Guest" option
- [ ] Clear distinction from email auth

---

## Phase 12: Polish & Animation

### Micro-interactions

- [ ] Button press: `scale(0.9)` with 100ms transition
- [ ] Tab switch: smooth color transition
- [ ] Card swipe: rotation based on drag direction
- [ ] Counter increment: subtle bounce animation

### Page Transitions

- [ ] Fade + translateY animation
- [ ] Duration: 200-250ms
- [ ] Easing: ease-out
- [ ] Smooth and non-jarring

### Loading States

- [ ] Skeleton loaders match final layout
- [ ] Pulse animation on skeletons
- [ ] Spinner for action buttons when processing

### Celebrations

- [ ] Keep existing confetti for milestones
- [ ] Add XP milestone confetti (every 100 XP)
- [ ] Satisfying feedback loop

---

## Implementation Order

### Sprint 1: Foundation

1. [x] Update color system in `main.css`
2. [x] Create `ActionButton.vue` component
3. [x] Create `xpStore.ts`

### Sprint 2: Swipe Experience

4. [x] Redesign `SwipeCard.vue`
5. [x] Update `SwipePage.vue` with new action buttons
6. [x] Add XP display to header in `AppShell.vue`
7. [x] Create `XpPopup.vue` and integrate

### Sprint 3: Navigation & Sheets

8. [x] Redesign `BottomNav.vue`
9. [x] Update `DiscardSheet.vue`
10. [x] Update `BoxPickerSheet.vue`

### Sprint 4: Other Pages

11. [x] Update `AddPage.vue`
12. [x] Update `ItemsPage.vue`
13. [ ] Update `StatsPage.vue`
14. [ ] Update `AuthPage.vue`

### Sprint 5: Polish

15. [ ] Refine animations and transitions
16. [ ] Test dark/light mode consistency
17. [ ] Accessibility review
18. [ ] Performance check

---

## File Summary

### New Files

| File                              | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `src/components/ActionButton.vue` | Reusable Tinder-style circular button |
| `src/components/XpPopup.vue`      | Floating +XP animation component      |
| `src/stores/xpStore.ts`           | XP state management                   |

### Modified Files (High Impact)

| File                           | Changes                                |
| ------------------------------ | -------------------------------------- |
| `src/assets/main.css`          | Color system, gradients, new utilities |
| `src/components/SwipeCard.vue` | Complete card layout redesign          |
| `src/pages/SwipePage.vue`      | Action buttons, layout, XP integration |
| `src/components/BottomNav.vue` | Tinder-style navigation                |
| `src/components/AppShell.vue`  | Header branding, XP display            |

### Modified Files (Medium Impact)

| File                                | Changes                    |
| ----------------------------------- | -------------------------- |
| `src/components/DiscardSheet.vue`   | Button styling updates     |
| `src/components/BoxPickerSheet.vue` | Card styling updates       |
| `src/components/BoxCard.vue`        | Enhanced gradients         |
| `src/pages/AddPage.vue`             | Button redesign            |
| `src/pages/ItemsPage.vue`           | Visual updates             |
| `src/pages/StatsPage.vue`           | XP display, visual updates |
| `src/pages/AuthPage.vue`            | Branding, styling          |

---

## Success Criteria

- [ ] Swipe experience feels fun and satisfying
- [ ] Action buttons are prominent and easy to tap
- [ ] XP counter is visible and updates on actions
- [ ] +XP popup appears after each action
- [ ] Colors are vibrant on both dark and light backgrounds
- [ ] Navigation is clear and intuitive
- [ ] All existing functionality still works
- [ ] Performance remains smooth (60fps animations)
- [ ] Accessibility is maintained (focus states, screen reader support)
- [ ] Dark and light modes both look polished

---

## Technical Notes

### Gradient Implementation

Use CSS custom properties for gradients to enable easy theming:

```css
--gradient-keep: linear-gradient(135deg, #10b981, #34d399);
--gradient-discard: linear-gradient(135deg, #f43f5e, #fb7185);
```

### XP Persistence

Store XP in localStorage to persist across sessions:

```typescript
const XP_STORAGE_KEY = 'superswiper-xp'
```

### Animation Performance

Use `transform` and `opacity` for animations to ensure GPU acceleration:

```css
.action-button:active {
  transform: scale(0.9);
  transition: transform 0.1s ease-out;
}
```

### Component Composition

The ActionButton should be flexible enough for use in:

- Swipe page action row
- Discard sheet options
- Any future action contexts
