# SuperSwiper - Product Plan

A Tinder-style decluttering app designed for people with ADHD to sort through physical items in their home using satisfying swipe mechanics and gamification.

## Core Concept

Users photograph items they need to sort, then swipe through them:

- **Swipe Left** → Discard (Trash / Donate / Sell)
- **Swipe Right** → Keep (assign to a Box/Place)

The experience is designed to be quick, rewarding, and low-friction to help overcome executive function challenges.

---

## Data Model

### Entities

```
$users (InstantDB built-in)
├── email: string (unique, indexed, optional)
├── imageURL: string (optional)
├── itemsSorted: number (all-time counter)

items
├── id: string
├── name: string (user-editable, future: AI-generated)
├── photoPath: string (InstantDB storage path)
├── status: 'unsorted' | 'kept' | 'trash' | 'donate' | 'sell'
├── createdAt: number (timestamp)
├── sortedAt: number (timestamp, optional)
└── [link] owner: $users (many-to-one)
└── [link] box: boxes (many-to-one, optional)

boxes
├── id: string
├── name: string
├── gradient: number (0-7, index into preset gradient palette)
├── createdAt: number (timestamp)
└── [link] owner: $users (many-to-one)
└── [link] items: items (one-to-many, derived)
```

### Links

- `itemOwner`: items → $users (each item belongs to one user)
- `boxOwner`: boxes → $users (each box belongs to one user)
- `itemBox`: items → boxes (each kept item belongs to one box)

### Permissions

- Users can only view/edit their own items and boxes
- Items and boxes are private to their owner

---

## Screens & Routes

### 1. Auth (`/auth`)

- Magic code authentication via InstantDB
- Email input → code sent → code input → authenticated
- Redirect to swipe mode after auth

### 2. Swipe Mode (`/` - Main screen)

- Full-screen card showing current unsorted item
- Photo fills the card with item name overlaid at bottom
- Tinder-style swipe gestures:
  - Swipe left: card rotates CCW and flies off left
  - Swipe right: card rotates CW and flies off right
- Visual indicators while dragging (color tint, icons)
- After swipe left: bottom sheet with Trash/Donate/Sell buttons
- After swipe right: bottom sheet with box grid + "New Box" button
- Empty state when no unsorted items (celebration + CTA to add more)
- Session streak counter (resets on page refresh)
- Confetti explosion after 5 items sorted in session

### 3. Add Items (`/add`)

- Two modes:
  - **Camera**: Large capture button, tap to take photo, instant item creation
  - **Upload**: File picker for batch upload, each photo becomes an item
- After capture/upload: brief success feedback, stay on screen for more
- Items created with status 'unsorted', name defaults to "Item" (all items named "Item" until manually edited)

### 4. View All Items (`/items`)

- Header with total items sorted counter
- **Boxes section**: 2-column grid of box cards
  - Each card shows: box name, item count, placeholder gradient background
  - Sorted by item count (most items first)
- **Discard section**: 3 full-width category buttons
  - Trash (with count)
  - Donate (with count)
  - Sell (with count)
- Tap on box/category → navigates to detail view

### 5. Box/Category Detail (`/items/box/:boxId` or `/items/category/:category`)

- Header with box/category name and item count
- Grid of item cards (photo thumbnails with name)
- Tap item → item detail modal
- Item detail modal:
  - Full photo
  - Editable name field
  - "Move to..." button → shows destination picker
  - Can move to any box OR any discard category (trash/donate/sell)
  - Moving changes status accordingly

### 6. Create Box (Modal/Sheet)

- Text input for box name
- Create button
- Box created immediately (can exist with 0 items)
- Randomly assigned gradient from preset palette (~8 options)
- Future: AI image generation

---

## Navigation Structure

```
┌─────────────────────────────────────────┐
│              App Shell                   │
│  ┌─────────────────────────────────┐    │
│  │         <RouterView>            │    │
│  │                                 │    │
│  │                                 │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │      Bottom Navigation Bar       │    │
│  │  [Swipe]    [Add]    [Items]    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

- Bottom nav visible on all authenticated screens
- 3 tabs: Swipe (home), Add (+), Items (list)
- Settings menu (accessible from header or nav) with logout action

---

## Component Architecture

```
src/
├── components/
│   ├── AppShell.vue           # Layout with bottom nav
│   ├── BottomNav.vue          # Navigation bar
│   ├── SwipeCard.vue          # The draggable item card
│   ├── SwipeOverlay.vue       # Left/right action indicators
│   ├── DiscardSheet.vue       # Trash/Donate/Sell picker
│   ├── BoxPickerSheet.vue     # Box selection grid
│   ├── BoxCard.vue            # Box display card
│   ├── ItemCard.vue           # Item thumbnail card
│   ├── ItemModal.vue          # Item detail/edit modal
│   ├── CreateBoxModal.vue     # New box form
│   ├── ConfettiExplosion.vue  # Celebration animation
│   ├── EmptyState.vue         # No items state
│   └── GradientBackground.vue # Reusable gradient bg
│
├── pages/
│   ├── AuthPage.vue           # Login flow
│   ├── SwipePage.vue          # Main swipe experience
│   ├── AddPage.vue            # Camera/upload
│   ├── ItemsPage.vue          # View all items
│   └── ItemsDetailPage.vue    # Box/category detail
│
├── composables/
│   ├── useAuth.ts             # Auth state & methods
│   ├── useItems.ts            # Item queries & mutations
│   ├── useBoxes.ts            # Box queries & mutations
│   ├── useSwipe.ts            # Swipe gesture logic
│   ├── useCamera.ts           # Camera capture
│   ├── useUpload.ts           # File upload to InstantDB
│   ├── useImageCompression.ts # Client-side image resize/compress
│   └── useStreak.ts           # Session streak tracking
│
├── db.ts                      # InstantDB instance
├── instant.schema.ts          # Data schema
├── instant.perms.ts           # Permissions
├── router/index.ts            # Vue Router config
├── main.ts                    # App entry
└── App.vue                    # Root component
```

---

## Visual Design

### Color Palette

Primary gradient direction: playful diagonals and radials

```
--color-keep: #10B981 → #34D399      (emerald, positive)
--color-discard: #F43F5E → #FB7185   (rose, removal)
--color-accent: #8B5CF6 → #A78BFA    (violet, actions)
--color-surface: #1F2937             (gray-800, cards)
--color-background: #111827          (gray-900, base)
--color-text: #F9FAFB                (gray-50)
--color-text-muted: #9CA3AF          (gray-400)
```

### Card Styling

- Rounded corners (2xl, ~16px)
- Subtle shadow
- Photo fills card with gradient overlay at bottom for text legibility
- Glassmorphism effects on overlays

### Animations

- **Swipe**: Spring physics for natural feel, rotation follows drag angle
- **Card enter**: Scale up from 0.95 with fade
- **Sheet**: Slide up from bottom with backdrop blur
- **Confetti**: Particle explosion from center
- **Button press**: Scale down slightly (0.95) on active
- **Success feedback**: Quick pulse/bounce

### Mobile-First Approach

- Full viewport height layouts (100dvh)
- Touch-friendly tap targets (min 44px)
- Safe area insets for notches
- Horizontal swipe gestures
- Bottom sheets instead of modals where possible

---

## Technical Implementation

### InstantDB Integration

**Queries (reactive, real-time)**:

- Unsorted items for current user
- All boxes for current user with item counts
- Items by box
- Items by discard category
- User stats (itemsSorted)

**Transactions**:

- Create item (with photo upload)
- Update item status (sort action)
- Update item name
- Create box
- Move item to different box
- Increment user's itemsSorted counter

### Swipe Gesture Implementation

Using pointer events for cross-platform support:

1. Track pointer down position
2. Calculate delta X/Y on move
3. Apply transform (translate + rotate based on deltaX)
4. Show left/right overlay based on threshold
5. On pointer up:
   - If past threshold: animate off-screen, trigger action
   - If not: spring back to center

Thresholds:

- Action trigger: 100px horizontal drag
- Rotation: 15° max at full drag

### Camera/Upload

**Camera capture**:

- Use `<input type="file" accept="image/*" capture="environment">`
- On mobile: opens native camera
- On desktop: opens file picker
- Compress/resize before upload (max 1200px, 80% quality)

**Batch upload**:

- Multiple file input
- Process sequentially to avoid overwhelming
- Show progress indicator
- Create items as uploads complete

### Session Streak

- Store count in Vue ref (resets on page refresh)
- Increment after each successful sort
- At count === 5: trigger confetti
- Continue counting beyond 5 (no additional celebrations for MVP)

---

## Implementation Phases

### Phase 1: Foundation

1. Set up InstantDB schema and permissions
2. Implement auth flow (magic codes)
3. Create app shell with bottom navigation
4. Set up routing

### Phase 2: Add Items

1. Camera capture component
2. Batch upload component
3. Image upload to InstantDB storage
4. Item creation with default name

### Phase 3: Swipe Experience

1. SwipeCard component with gesture handling
2. Swipe animations (fly off, spring back)
3. Discard sheet (Trash/Donate/Sell)
4. Box picker sheet
5. Create box flow
6. Sort action transactions

### Phase 4: View Items

1. Items overview page (boxes + categories)
2. Box/category detail page
3. Item detail modal
4. Edit item name
5. Move item between boxes

### Phase 5: Gamification

1. Session streak counter
2. Confetti celebration
3. All-time items sorted counter
4. Empty state celebrations

### Phase 6: Polish

1. Loading states
2. Error handling
3. Animation refinements
4. Edge cases (offline, errors)

---

## Future Enhancements (Post-MVP)

- **AI item naming**: Vision API to auto-generate names from photos
- **AI box images**: Generate location images from box names
- **Undo action**: Recently sorted items can be undone
- **Share box**: Generate shareable list for donation/sale items
- **Reminders**: Push notifications to continue sorting
- **Statistics**: Detailed breakdown of sorting history
- **Achievements**: Unlock badges for milestones
- **Sound effects**: Satisfying audio feedback
- **Dark/Light mode**: Currently dark-only, add light option

---

## Resolved Decisions

1. **Haptic feedback**: No - keeping it simple
2. **Photo compression**: Yes - max 1200px dimension, 80% JPEG quality, client-side via Canvas API
3. **Confetti style**: Whatever works best - vibrant colors matching theme
4. **Sell price field**: No - keeping mental effort minimal
