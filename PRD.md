# SuperSwiper - Requirements Tracker

## Phase 1: Foundation

### Schema & Database

- [ ] Define `items` entity (name, photoPath, status, createdAt, sortedAt)
- [ ] Define `boxes` entity (name, gradient, createdAt)
- [ ] Add `itemsSorted` field to $users
- [ ] Create `itemOwner` link (items → $users)
- [ ] Create `boxOwner` link (boxes → $users)
- [ ] Create `itemBox` link (items → boxes)
- [ ] Push schema to InstantDB

### Permissions

- [ ] Items: users can only CRUD their own items
- [ ] Boxes: users can only CRUD their own boxes
- [ ] $users: users can view/update their own record
- [ ] $files: users can upload and view their own files
- [ ] Push permissions to InstantDB

### Authentication

- [ ] Create `useAuth` composable wrapping InstantDB auth
- [ ] Create `AuthPage.vue` with email input step
- [ ] Add code verification step to AuthPage
- [ ] Handle auth errors with user feedback
- [ ] Redirect to home after successful auth

### App Shell & Navigation

- [ ] Create `AppShell.vue` layout component
- [ ] Create `BottomNav.vue` with 3 tabs (Swipe, Add, Items)
- [ ] Style bottom nav with active states
- [ ] Add safe area padding for mobile notches
- [ ] Add settings menu with logout action

### Routing

- [ ] Configure `/auth` route (AuthPage)
- [ ] Configure `/` route (SwipePage)
- [ ] Configure `/add` route (AddPage)
- [ ] Configure `/items` route (ItemsPage)
- [ ] Configure `/items/box/:boxId` route (ItemsDetailPage)
- [ ] Configure `/items/category/:category` route (ItemsDetailPage)
- [ ] Add auth guard to protected routes
- [ ] Hide bottom nav on auth page

### Base Styling

- [ ] Set up color variables in Tailwind config
- [ ] Configure dark theme as default
- [ ] Set up base typography
- [ ] Create 8 preset box gradient classes
- [ ] Create gradient utility classes for UI elements

---

## Phase 2: Add Items

### Image Utilities

- [ ] Create `useImageCompression` composable
- [ ] Implement resize to max 1200px dimension
- [ ] Implement JPEG compression at 80% quality
- [ ] Handle EXIF orientation correction

### Camera Capture

- [ ] Create camera input component
- [ ] Style large capture button
- [ ] Trigger native camera on mobile
- [ ] Compress image after capture
- [ ] Show capture success feedback

### Batch Upload

- [ ] Create file picker for multiple images
- [ ] Show selected files preview
- [ ] Process uploads sequentially
- [ ] Show upload progress indicator
- [ ] Handle upload errors gracefully

### InstantDB Storage Integration

- [ ] Create `useUpload` composable
- [ ] Upload compressed image to InstantDB storage
- [ ] Get file URL after upload
- [ ] Create item record linked to file

### Item Creation

- [ ] Create `useItems` composable
- [ ] Implement `createItem` transaction
- [ ] Set default name to "Item" (no numbering)
- [ ] Set status to "unsorted"
- [ ] Set createdAt timestamp
- [ ] Link item to current user

### Add Page UI

- [ ] Create `AddPage.vue`
- [ ] Toggle between camera and upload modes
- [ ] Show recently added items count
- [ ] Stay on page after adding (ready for more)

---

## Phase 3: Swipe Experience

### Swipe Gesture

- [ ] Create `useSwipe` composable
- [ ] Track pointer/touch down position
- [ ] Calculate drag delta on move
- [ ] Apply transform (translate + rotate)
- [ ] Detect left/right threshold (100px)
- [ ] Spring back animation when below threshold

### Swipe Card

- [ ] Create `SwipeCard.vue` component
- [ ] Display item photo (full bleed)
- [ ] Overlay item name at bottom
- [ ] Gradient overlay for text legibility
- [ ] Connect to swipe gesture composable

### Swipe Animations

- [ ] Fly-off animation (left)
- [ ] Fly-off animation (right)
- [ ] Card enter animation (scale + fade)
- [ ] Next card peek behind current card

### Action Overlays

- [ ] Create `SwipeOverlay.vue` component
- [ ] Show "KEEP" indicator on right drag
- [ ] Show "DISCARD" indicator on left drag
- [ ] Animate opacity based on drag distance
- [ ] Use appropriate colors (green/red)

### Discard Sheet

- [ ] Create `DiscardSheet.vue` component
- [ ] Slide-up animation from bottom
- [ ] Backdrop blur effect
- [ ] Three buttons: Trash, Donate, Sell
- [ ] Icon + label for each option
- [ ] Close on selection or tap outside

### Box Picker Sheet

- [ ] Create `BoxPickerSheet.vue` component
- [ ] 2-column grid of boxes
- [ ] Sort boxes by item count (descending)
- [ ] Show box name and item count
- [ ] Display box's assigned gradient background
- [ ] "Create new box" button at end
- [ ] Close on selection

### Create Box Flow

- [ ] Create `CreateBoxModal.vue` component
- [ ] Text input for box name
- [ ] Create button
- [ ] Create `useBoxes` composable
- [ ] Implement `createBox` transaction
- [ ] Assign random gradient index (0-7) on creation
- [ ] Box created immediately (can exist with 0 items)
- [ ] Auto-select newly created box when in swipe flow

### Sort Transactions

- [ ] Implement `discardItem` (update status to trash/donate/sell)
- [ ] Implement `keepItem` (update status to kept, link to box)
- [ ] Set sortedAt timestamp on sort
- [ ] Increment user's itemsSorted counter

### Swipe Page

- [ ] Create `SwipePage.vue`
- [ ] Query unsorted items for user
- [ ] Show current item in SwipeCard
- [ ] Handle swipe completion → show appropriate sheet
- [ ] Advance to next item after sort
- [ ] Handle empty state (no unsorted items)

---

## Phase 4: View Items

### Items Overview Page

- [ ] Create `ItemsPage.vue`
- [ ] Header with "Items Sorted" counter
- [ ] Boxes section with 2-column grid
- [ ] Create `BoxCard.vue` component
- [ ] Show box name, item count, assigned gradient bg
- [ ] Query boxes with item counts
- [ ] Discard categories section (full-width)
- [ ] Trash button with count
- [ ] Donate button with count
- [ ] Sell button with count
- [ ] Navigate to detail on tap

### Items Detail Page

- [ ] Create `ItemsDetailPage.vue`
- [ ] Handle both box and category routes
- [ ] Header with back button, name, count
- [ ] Grid of item thumbnails
- [ ] Create `ItemCard.vue` component
- [ ] Show photo thumbnail and name
- [ ] Tap to open item modal

### Item Modal

- [ ] Create `ItemModal.vue` component
- [ ] Full-size photo display
- [ ] Editable name field
- [ ] Save name on blur/enter
- [ ] "Move to..." button
- [ ] Open destination picker (boxes + discard categories)
- [ ] Allow moving to any box or any discard category
- [ ] Implement `updateItemName` transaction
- [ ] Implement `moveItem` transaction (handles status change)
- [ ] Close modal on backdrop tap

---

## Phase 5: Gamification

### Session Streak

- [ ] Create `useStreak` composable
- [ ] Track items sorted in current session
- [ ] Increment on each sort action
- [ ] Reset on page refresh (ref-based)
- [ ] Expose streak count for display

### Confetti Celebration

- [ ] Create `ConfettiExplosion.vue` component
- [ ] Particle animation system
- [ ] Trigger at streak count === 5
- [ ] Use vibrant colors matching theme
- [ ] ~2 second duration
- [ ] Clean up particles after animation

### Stats Display

- [ ] Show session streak on swipe page
- [ ] Show all-time sorted count on items page
- [ ] Subtle animation on counter increment

### Empty State

- [ ] Create `EmptyState.vue` component
- [ ] Celebratory message when all sorted
- [ ] "Add more items" CTA button
- [ ] Playful illustration or animation

---

## Phase 6: Polish

### Loading States

- [ ] Auth page loading during magic code send
- [ ] Upload progress indicator
- [ ] Swipe page skeleton while loading items
- [ ] Items page skeleton while loading

### Error Handling

- [ ] Auth error messages
- [ ] Upload failure handling with retry
- [ ] Network error toast notifications
- [ ] Graceful degradation for failed image loads

### Animation Refinements

- [ ] Button press feedback (scale)
- [ ] Page transition animations
- [ ] Sheet open/close smoothness
- [ ] Card stack visual depth

### Edge Cases

- [ ] Handle very long item/box names
- [ ] Handle missing/broken images
- [ ] Handle rapid successive swipes
- [ ] Handle offline state (InstantDB handles this)

---

## Future (Post-MVP)

### AI Features

- [ ] AI item naming via Vision API
- [ ] AI box image generation
- [ ] Cloudflare Worker for AI endpoints

### Additional Features

- [ ] Undo recent sort action
- [ ] Share donate/sell lists
- [ ] Push notification reminders
- [ ] Detailed statistics page
- [ ] Achievement badges
- [ ] Sound effects
- [ ] Light mode option

---

## Technical Debt & Maintenance

- [ ] Add unit tests for composables
- [ ] Add component tests for critical flows
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Performance audit (bundle size, render performance)
- [ ] Accessibility audit (screen reader, keyboard nav)
