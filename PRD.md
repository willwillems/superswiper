# SuperSwiper - Requirements Tracker

## Phase 1: Foundation

### Schema & Database

- [x] Define `items` entity (name, photoPath, status, createdAt, sortedAt)
- [x] Define `boxes` entity (name, gradient, createdAt)
- [x] Add `itemsSorted` field to $users
- [x] Create `itemOwner` link (items → $users)
- [x] Create `boxOwner` link (boxes → $users)
- [x] Create `itemBox` link (items → boxes)
- [x] Push schema to InstantDB

### Permissions

- [x] Items: users can only CRUD their own items
- [x] Boxes: users can only CRUD their own boxes
- [x] $users: users can view/update their own record
- [x] $files: users can upload and view their own files
- [x] Push permissions to InstantDB

### Authentication

- [x] Create `useAuth` composable wrapping InstantDB auth
- [x] Create `AuthPage.vue` with email input step
- [x] Add code verification step to AuthPage
- [x] Handle auth errors with user feedback
- [x] Redirect to home after successful auth

### App Shell & Navigation

- [x] Create `AppShell.vue` layout component
- [x] Create `BottomNav.vue` with 3 tabs (Swipe, Add, Items)
- [x] Style bottom nav with active states
- [x] Add safe area padding for mobile notches
- [x] Add settings menu with logout action

### Routing

- [x] Configure `/auth` route (AuthPage)
- [x] Configure `/` route (SwipePage)
- [x] Configure `/add` route (AddPage)
- [x] Configure `/items` route (ItemsPage)
- [x] Configure `/items/box/:boxId` route (ItemsDetailPage)
- [x] Configure `/items/category/:category` route (ItemsDetailPage)
- [x] Add auth guard to protected routes
- [x] Hide bottom nav on auth page

### Base Styling

- [x] Set up color variables in Tailwind config
- [x] Configure dark theme as default
- [x] Set up base typography
- [x] Create 8 preset box gradient classes
- [x] Create gradient utility classes for UI elements

---

## Phase 2: Add Items

### Image Utilities

- [x] Create `useImageCompression` composable
- [x] Implement resize to max 1200px dimension
- [x] Implement JPEG compression at 80% quality
- [x] Handle EXIF orientation correction

### Camera Capture

- [x] Create camera input component
- [x] Style large capture button
- [x] Trigger native camera on mobile
- [x] Compress image after capture
- [x] Show capture success feedback

### Batch Upload

- [x] Create file picker for multiple images
- [x] Show selected files preview
- [x] Process uploads sequentially
- [x] Show upload progress indicator
- [x] Handle upload errors gracefully

### InstantDB Storage Integration

- [x] Create `useUpload` composable
- [x] Upload compressed image to InstantDB storage
- [x] Get file URL after upload
- [x] Create item record linked to file

### Item Creation

- [x] Create `useItems` composable
- [x] Implement `createItem` transaction
- [x] Set default name to "Item" (no numbering)
- [x] Set status to "unsorted"
- [x] Set createdAt timestamp
- [x] Link item to current user

### Add Page UI

- [x] Create `AddPage.vue`
- [x] Toggle between camera and upload modes
- [x] Show recently added items count
- [x] Stay on page after adding (ready for more)

---

## Phase 3: Swipe Experience

### Swipe Gesture

- [x] Create `useSwipe` composable
- [x] Track pointer/touch down position
- [x] Calculate drag delta on move
- [x] Apply transform (translate + rotate)
- [x] Detect left/right threshold (100px)
- [x] Spring back animation when below threshold

### Swipe Card

- [x] Create `SwipeCard.vue` component
- [x] Display item photo (full bleed)
- [x] Overlay item name at bottom
- [x] Gradient overlay for text legibility
- [x] Connect to swipe gesture composable

### Swipe Animations

- [x] Fly-off animation (left)
- [x] Fly-off animation (right)
- [x] Card enter animation (scale + fade)
- [x] Next card peek behind current card

### Action Overlays

- [x] Create `SwipeOverlay.vue` component
- [x] Show "KEEP" indicator on right drag
- [x] Show "DISCARD" indicator on left drag
- [x] Animate opacity based on drag distance
- [x] Use appropriate colors (green/red)

### Discard Sheet

- [x] Create `DiscardSheet.vue` component
- [x] Slide-up animation from bottom
- [x] Backdrop blur effect
- [x] Three buttons: Trash, Donate, Sell
- [x] Icon + label for each option
- [x] Close on selection or tap outside

### Box Picker Sheet

- [x] Create `BoxPickerSheet.vue` component
- [x] 2-column grid of boxes
- [x] Sort boxes by item count (descending)
- [x] Show box name and item count
- [x] Display box's assigned gradient background
- [x] "Create new box" button at end
- [x] Close on selection

### Create Box Flow

- [x] Create `CreateBoxModal.vue` component
- [x] Text input for box name
- [x] Create button
- [x] Create `useBoxes` composable
- [x] Implement `createBox` transaction
- [x] Assign random gradient index (0-7) on creation
- [x] Box created immediately (can exist with 0 items)
- [x] Auto-select newly created box when in swipe flow

### Sort Transactions

- [x] Implement `discardItem` (update status to trash/donate/sell)
- [x] Implement `keepItem` (update status to kept, link to box)
- [x] Set sortedAt timestamp on sort
- [x] Increment user's itemsSorted counter

### Swipe Page

- [x] Create `SwipePage.vue`
- [x] Query unsorted items for user
- [x] Show current item in SwipeCard
- [x] Handle swipe completion → show appropriate sheet
- [x] Advance to next item after sort
- [x] Handle empty state (no unsorted items)

---

## Phase 4: View Items

### Items Overview Page

- [x] Create `ItemsPage.vue`
- [x] Header with "Items Sorted" counter
- [x] Boxes section with 2-column grid
- [x] Create `BoxCard.vue` component
- [x] Show box name, item count, assigned gradient bg
- [x] Query boxes with item counts
- [x] Discard categories section (full-width)
- [x] Trash button with count
- [x] Donate button with count
- [x] Sell button with count
- [x] Navigate to detail on tap

### Items Detail Page

- [x] Create `ItemsDetailPage.vue`
- [x] Handle both box and category routes
- [x] Header with back button, name, count
- [x] Grid of item thumbnails
- [x] Create `ItemCard.vue` component
- [x] Show photo thumbnail and name
- [x] Tap to open item modal

### Item Modal

- [x] Create `ItemModal.vue` component
- [x] Full-size photo display
- [x] Editable name field
- [x] Save name on blur/enter
- [x] "Move to..." button
- [x] Open destination picker (boxes + discard categories)
- [x] Allow moving to any box or any discard category
- [x] Implement `updateItemName` transaction
- [x] Implement `moveItem` transaction (handles status change)
- [x] Close modal on backdrop tap

---

## Phase 5: Gamification

### Session Streak

- [x] Create `useStreak` composable
- [x] Track items sorted in current session
- [x] Increment on each sort action
- [x] Reset on page refresh (ref-based)
- [x] Expose streak count for display

### Confetti Celebration

- [x] Create `ConfettiExplosion.vue` component
- [x] Particle animation system
- [x] Trigger at streak count === 5
- [x] Use vibrant colors matching theme
- [x] ~2 second duration
- [x] Clean up particles after animation

### Stats Display

- [x] Show session streak on swipe page
- [x] Show all-time sorted count on items page
- [x] Subtle animation on counter increment

### Empty State

- [x] Create `EmptyState.vue` component
- [x] Celebratory message when all sorted
- [x] "Add more items" CTA button
- [x] Playful illustration or animation

---

## Phase 6: Polish

### Loading States

- [x] Auth page loading during magic code send
- [x] Upload progress indicator
- [x] Swipe page skeleton while loading items
- [x] Items page skeleton while loading

### Error Handling

- [x] Auth error messages
- [x] Upload failure handling with retry
- [x] Network error toast notifications
- [x] Graceful degradation for failed image loads

### Animation Refinements

- [x] Button press feedback (scale)
- [x] Page transition animations
- [x] Sheet open/close smoothness
- [x] Card stack visual depth

### Edge Cases

- [x] Handle very long item/box names
- [x] Handle missing/broken images
- [x] Handle rapid successive swipes
- [x] Handle offline state (InstantDB handles this)

---

## Future (Post-MVP)

### AI Features

- [-] AI item naming via Vision API
- [-] AI box image generation
- [-] Cloudflare Worker for AI endpoints

### Additional Features

- [x] Undo recent sort action
- [ ] Share donate/sell lists
- [ ] Push notification reminders
- [ ] Detailed statistics page
- [ ] Achievement badges
- [ ] Sound effects
- [ ] Light mode option

---

## Technical Debt & Maintenance

- [x] Add unit tests for composables
- [x] Add component tests for critical flows
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Performance audit (bundle size, render performance)
- [ ] Accessibility audit (screen reader, keyboard nav)
