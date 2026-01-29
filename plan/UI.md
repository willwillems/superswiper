# UI Redesign Plan: SuperSwiper

## Vision

Transform SuperSwiper from a functional decluttering tool into a **fun, playful, and engaging** experience heavily inspired by Tinder's visual language.

### Design Principles

- **Fun & Playful**: Every interaction should feel satisfying and game-like
- **Vibrant**: Bold gradients and colors on cards/elements against clean backgrounds
- **Rewarding**: XP system provides constant positive feedback
- **Familiar**: Tinder-inspired patterns reduce learning curve

### Key Inspirations (from reference screenshots)

| Element        | Inspiration                                         |
| -------------- | --------------------------------------------------- |
| Swipe cards    | Photo-dominant with name overlay at bottom          |
| Action buttons | Circular, colorful, Tinder-style (X, heart, rewind) |
| Gradients      | Coral-pink energy, applied to cards not backgrounds |
| Bottom nav     | Icon + label, colored active state                  |
| Gamification   | Points/XP visible in header, earned on actions      |

---

## Phase 1: Foundation & Global Styling

### 1.1 Color System Update

**Current semantic colors** (keep these meanings):

- Keep: `#10B981` (emerald green)
- Discard: `#F43F5E` (rose red)
- Accent: `#8B5CF6` (violet)

**Add gradient variants**:

```css
--gradient-keep: linear-gradient(135deg, #10b981, #34d399);
--gradient-discard: linear-gradient(135deg, #f43f5e, #fb7185);
--gradient-accent: linear-gradient(135deg, #8b5cf6, #a78bfa);
--gradient-undo: linear-gradient(135deg, #f59e0b, #fbbf24);
--gradient-card: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.8) 100%);
```

**Background approach**:

- Dark mode: `#111827` (current gray-900) — clean, lets cards pop
- Light mode: `#F9FAFB` (gray-50) — clean, lets cards pop
- Gradients live on cards and buttons, NOT on page backgrounds

**Files to modify**:

- `src/assets/main.css`

### 1.2 Typography & Branding

**Header branding**:

- Playful "SuperSwiper" treatment
- Consider: gradient text, custom letter styling, or small icon
- Keep it compact — header also needs XP counter

**Font weights**:

- Titles: `font-bold` (700)
- Body: `font-medium` (500)
- Muted: `font-normal` (400)

**Files to modify**:

- `src/components/AppShell.vue`

### 1.3 Action Button Component

Create a new reusable circular action button:

```
┌─────────────────────────────────────┐
│  ActionButton.vue                   │
├─────────────────────────────────────┤
│  Props:                             │
│  - variant: 'keep' | 'discard' |    │
│             'undo'                  │
│  - size: 'sm' | 'md' | 'lg'        │
│  - icon: string (icon name)         │
│  - disabled: boolean                │
│                                     │
│  Styles:                            │
│  - Circular shape                   │
│  - Gradient or solid background     │
│  - White icon centered              │
│  - Shadow for depth                 │
│  - Scale animation on press         │
│  - Size variants:                   │
│    sm: 40px, md: 56px, lg: 72px    │
└─────────────────────────────────────┘
```

**Visual reference** (Tinder-style):

```
    ┌───┐         ┌─────┐         ┌─────┐         ┌───┐
    │ ↺ │         │  ✕  │         │  ♥  │         │ ⭐ │
    └───┘         └─────┘         └─────┘         └───┘
   yellow          rose           green           blue
    small          large          large           small
```

**Files to create**:

- `src/components/ActionButton.vue`

---

## Phase 2: Swipe Experience Redesign

### 2.1 SwipeCard Component

**Current layout**:

```
┌────────────────────────┐
│ ┌──────────────────┐   │
│ │                  │   │
│ │      Photo       │   │
│ │                  │   │
│ │  ┌────────────┐  │   │
│ │  │ Category   │  │   │
│ │  │ Name       │  │   │
│ │  └────────────┘  │   │
│ └──────────────────┘   │
└────────────────────────┘
```

**New layout** (Tinder-inspired):

```
┌────────────────────────┐
│                        │
│                        │
│        Photo           │
│    (fills card)        │
│                        │
│ ░░░░░░░░░░░░░░░░░░░░░░ │  ← gradient overlay
│ Name                   │
│ Optional subtitle      │
└────────────────────────┘
```

**Key changes**:

- Photo fills entire card (object-cover)
- Rounded corners on card: `rounded-3xl` (24px)
- Bottom gradient overlay for text legibility
- Name in bold white at bottom-left
- Remove category badge from card face
- Aspect ratio: maintain ~3:4 or allow flexible height

**Files to modify**:

- `src/components/SwipeCard.vue`

### 2.2 Action Buttons Row

**Current**:

```
[ Discard ]  [ Keep ]
   (text buttons)
```

**New** (Tinder-style):

```
      ┌───┐    ┌─────┐    ┌─────┐
      │ ↺ │    │  ✕  │    │  ✓  │
      └───┘    └─────┘    └─────┘
      Undo     Discard     Keep
     yellow     rose      green
      48px      64px       64px
```

**Button specifications**:

| Button  | Color        | Size | Icon               | Action              |
| ------- | ------------ | ---- | ------------------ | ------------------- |
| Undo    | Amber/Yellow | 48px | Arrow rotate left  | Go to previous item |
| Discard | Rose/Red     | 64px | X mark             | Open discard sheet  |
| Keep    | Green        | 64px | Heart or checkmark | Open box picker     |

**Interaction states**:

- Default: Full color with shadow
- Pressed: `scale(0.9)` + slightly darker
- Disabled: 50% opacity, no shadow

**Files to modify**:

- `src/pages/SwipePage.vue`

### 2.3 SwipePage Layout

**Current structure**:

```
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│                     │
│   [Card Stack]      │
│                     │
│   [Buttons]         │
│                     │
├─────────────────────┤
│ Bottom Nav          │
└─────────────────────┘
```

**New structure** (same, but refined):

```
┌─────────────────────┐
│ Header + XP         │
├─────────────────────┤
│                     │
│   ┌───────────┐     │
│   │ Card 3    │     │  ← more pronounced
│   └───────────┘     │     card stack effect
│   ┌─────────────┐   │
│   │ Card 2      │   │
│   └─────────────┘   │
│   ┌───────────────┐ │
│   │               │ │
│   │   Card 1     │ │
│   │   (active)   │ │
│   │               │ │
│   └───────────────┘ │
│                     │
│   (↺)  (✕)   (✓)    │  ← action buttons
│                     │
├─────────────────────┤
│ Bottom Nav          │
└─────────────────────┘
```

**Spacing**:

- Card stack: centered, `px-4` horizontal padding
- Action buttons: centered below cards, `gap-6` between buttons
- Generous vertical spacing between card and buttons

**Files to modify**:

- `src/pages/SwipePage.vue`
- `src/components/SwipeCardBackground.vue`

---

## Phase 3: XP System (Basic)

### 3.1 XP Store

**State structure**:

```typescript
interface XpState {
  total: number
  history: Array<{
    amount: number
    action: 'keep' | 'discard' | 'undo'
    timestamp: number
  }>
}
```

**Point values**:
| Action | Points |
|--------|--------|
| Keep | +5 |
| Discard (any) | +5 |
| Undo | 0 (no penalty) |

**Persistence**: localStorage with key `superswiper-xp`

**Files to create**:

- `src/stores/xpStore.ts`

### 3.2 XP Header Display

**Location**: Right side of header, before theme toggle

**Design**:

```
┌─────────────────────────────────────┐
│ SuperSwiper          ⚡ 245   🌙  ↪ │
│                       └─ XP counter │
└─────────────────────────────────────┘
```

**Styling**:

- Small lightning bolt or star icon
- Number in accent color or gradient text
- `font-semibold`, `text-sm`

**Files to modify**:

- `src/components/AppShell.vue`

### 3.3 XP Popup Feedback

**Trigger**: After each keep/discard action

**Animation**:

```
     +5 XP ↑
       ↑
       ↑ (floats up and fades)
    [card]
```

**Behavior**:

- Appears above the card that was just swiped
- Floats upward 50px over 600ms
- Fades out during float
- Green color for keep, rose for discard

**Files to create**:

- `src/components/XpPopup.vue`

**Files to modify**:

- `src/pages/SwipePage.vue` (integrate popup)

---

## Phase 4: Bottom Navigation

### 4.1 Navigation Redesign

**Current**:

```
┌─────────────────────────────────────┐
│   🔥      ➕      📦      📊       │
│  Swipe   Add    Items   Stats      │
│  (icons only, subtle)              │
└─────────────────────────────────────┘
```

**New** (Tinder-style):

```
┌─────────────────────────────────────┐
│                                     │
│   🔥       ➕       📦       📊    │
│  Swipe    Add     Items    Stats   │
│   ───                              │
│   ^ active indicator (colored)     │
└─────────────────────────────────────┘
```

**Specifications**:

- Vertical layout per item: icon above label
- Active state: colored icon + colored label + optional underline
- Inactive state: muted gray icon and label
- Icons: Consider using more expressive icons (flame for swipe, camera for add, etc.)
- Tap feedback: subtle scale animation

**Active color**: Use accent color (`--color-accent`) for active tab

**Files to modify**:

- `src/components/BottomNav.vue`

---

## Phase 5: Sheets & Modals

### 5.1 Discard Sheet

**Current**: Bottom sheet with Trash/Donate/Sell buttons

**Updates**:

- Keep bottom sheet pattern
- Update buttons to use new ActionButton component or similar styling
- Add colorful icons:
  - Trash: 🗑️ with gray/neutral gradient
  - Donate: 🎁 with warm orange/coral gradient
  - Sell: 💰 with green/teal gradient
- Larger touch targets (min 56px height)
- Rounded button style matching new design language

**Files to modify**:

- `src/components/DiscardSheet.vue`

### 5.2 Box Picker Sheet

**Current**: Grid of gradient-colored box cards

**Updates**:

- Keep existing gradient system (it's already vibrant)
- Increase card size slightly for easier tapping
- Add subtle shadow for depth
- "Create new box" button with dashed border + plus icon
- Consider adding checkmark indicator for selected box

**Visual**:

```
┌─────────────────────────────────────┐
│ Choose a Box                    ✕   │
├─────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐           │
│ │ Kitchen │  │ Bedroom │           │
│ │ 🧡      │  │ 💜      │           │
│ └─────────┘  └─────────┘           │
│ ┌─────────┐  ┌ ─ ─ ─ ─ ┐           │
│ │ Garage  │  │  + New  │           │
│ │ 💙      │  └ ─ ─ ─ ─ ┘           │
│ └─────────┘                        │
└─────────────────────────────────────┘
```

**Files to modify**:

- `src/components/BoxPickerSheet.vue`
- `src/components/BoxCard.vue`

### 5.3 Create Box Modal

**Updates**:

- Match new visual language
- Rounded input field
- Primary action button with gradient
- Consider: emoji picker for box icon (future enhancement)

**Files to modify**:

- `src/components/CreateBoxModal.vue`

---

## Phase 6: Other Pages

### 6.1 Add Page

**Updates**:

- Camera/Upload buttons using new button styling
- Large, tappable circular or rounded-rect buttons
- Playful icons (camera, photo library)
- Instructional text with friendly tone
- Empty state when camera not available

**Layout**:

```
┌─────────────────────────────────────┐
│                                     │
│         ┌───────────────┐           │
│         │               │           │
│         │   📷 Camera   │           │
│         │               │           │
│         └───────────────┘           │
│                                     │
│         ┌───────────────┐           │
│         │               │           │
│         │   🖼️ Upload   │           │
│         │               │           │
│         └───────────────┘           │
│                                     │
│    Take a photo or upload one       │
│                                     │
└─────────────────────────────────────┘
```

**Files to modify**:

- `src/pages/AddPage.vue`

### 6.2 Items Page

**Updates**:

- Section headings with playful typography
- Box cards: already have gradients, ensure they're vibrant
- Discard category rows: add colored icons matching sheet
- Empty states: friendly illustrations or emojis

**Layout**:

```
┌─────────────────────────────────────┐
│ Your Items                          │
├─────────────────────────────────────┤
│ Boxes                               │
│ ┌────────┐ ┌────────┐ ┌────────┐   │
│ │Kitchen │ │Bedroom │ │ +New   │   │
│ │   12   │ │   8    │ │        │   │
│ └────────┘ └────────┘ └────────┘   │
├─────────────────────────────────────┤
│ Discarded                           │
│ ┌─────────────────────────────────┐ │
│ │ 🗑️ Trash                    23 │ │
│ ├─────────────────────────────────┤ │
│ │ 🎁 Donate                   15 │ │
│ ├─────────────────────────────────┤ │
│ │ 💰 Sell                      7 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Files to modify**:

- `src/pages/ItemsPage.vue`
- `src/pages/ItemsDetailPage.vue`

### 6.3 Stats Page

**Updates**:

- XP total prominently at top
- Progress bars with gradient fills
- Colorful category breakdown
- Playful empty state

**Layout**:

```
┌─────────────────────────────────────┐
│ Statistics                          │
├─────────────────────────────────────┤
│        ⚡ 1,245 XP                  │
│        Level 5 Declutterer          │
├─────────────────────────────────────┤
│ Progress                            │
│ ████████████░░░░░░░░ 67%           │
│ 45 of 67 items sorted               │
├─────────────────────────────────────┤
│ Breakdown                           │
│ ✓ Kept      ████████████  32       │
│ 🗑️ Trash    ████          8        │
│ 🎁 Donate   ██            3        │
│ 💰 Sell     ██            2        │
└─────────────────────────────────────┘
```

**Note**: Level system is stretch goal; basic XP counter first

**Files to modify**:

- `src/pages/StatsPage.vue`

### 6.4 Auth Page

**Updates**:

- Playful branded header
- Clean, welcoming layout
- Rounded input fields
- Primary button with gradient or accent color
- Friendly copy

**Files to modify**:

- `src/pages/AuthPage.vue`

---

## Phase 7: Polish & Animation

### 7.1 Micro-interactions

**Button presses**:

```css
.action-button:active {
  transform: scale(0.9);
  transition: transform 0.1s ease-out;
}
```

**Card swipe feedback**:

- Keep existing gesture system
- Add subtle rotation based on drag direction
- Color tint overlay showing keep (green) / discard (red) intent

**Tab switches**:

- Smooth color transition on active state
- Optional: slight bounce on icon

### 7.2 Page Transitions

**Keep existing** but ensure they feel smooth:

- Fade + slight translateY
- Duration: 200-250ms
- Easing: ease-out

### 7.3 Celebrations

**Keep existing confetti** for milestones

**Add XP milestone celebrations**:

- Every 100 XP: small confetti burst
- Every 500 XP: larger celebration
- (Consider: sound effects, haptic feedback in future)

---

## Implementation Order

### Sprint 1: Foundation

1. [ ] Update color system in `main.css`
2. [ ] Create `ActionButton.vue` component
3. [ ] Create `xpStore.ts`

### Sprint 2: Swipe Experience

4. [ ] Redesign `SwipeCard.vue`
5. [ ] Update `SwipePage.vue` with new action buttons
6. [ ] Add XP to header in `AppShell.vue`
7. [ ] Create `XpPopup.vue` and integrate

### Sprint 3: Navigation & Sheets

8. [ ] Redesign `BottomNav.vue`
9. [ ] Update `DiscardSheet.vue`
10. [ ] Update `BoxPickerSheet.vue`

### Sprint 4: Other Pages

11. [ ] Update `AddPage.vue`
12. [ ] Update `ItemsPage.vue`
13. [ ] Update `StatsPage.vue`
14. [ ] Update `AuthPage.vue`

### Sprint 5: Polish

15. [ ] Refine animations and transitions
16. [ ] Test dark/light mode consistency
17. [ ] Accessibility review
18. [ ] Performance check

---

## File Change Summary

### New Files

| File                              | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `src/components/ActionButton.vue` | Reusable Tinder-style circular button |
| `src/components/XpPopup.vue`      | Floating +XP animation                |
| `src/stores/xpStore.ts`           | XP state management                   |

### Modified Files (High Impact)

| File                           | Changes                                |
| ------------------------------ | -------------------------------------- |
| `src/assets/main.css`          | Color system, gradients, new utilities |
| `src/components/SwipeCard.vue` | Complete card redesign                 |
| `src/pages/SwipePage.vue`      | Action buttons, layout, XP integration |
| `src/components/BottomNav.vue` | Tinder-style navigation                |
| `src/components/AppShell.vue`  | Header branding, XP display            |

### Modified Files (Medium Impact)

| File                                | Changes                    |
| ----------------------------------- | -------------------------- |
| `src/components/DiscardSheet.vue`   | Button styling             |
| `src/components/BoxPickerSheet.vue` | Card styling               |
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
- [ ] Colors are vibrant on both dark and light backgrounds
- [ ] Navigation is clear and Tinder-inspired
- [ ] All existing functionality still works
- [ ] Performance remains smooth (60fps animations)
- [ ] Accessibility is maintained (focus states, screen reader support)
