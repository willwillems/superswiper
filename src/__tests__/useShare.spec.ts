import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Item } from '../composables/useItems'

vi.mock('../composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}))

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Old Chair',
    photoPath: '/uploads/chair.jpg',
    status: 'donate',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Vintage Lamp',
    photoPath: '/uploads/lamp.jpg',
    status: 'donate',
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Books',
    photoPath: '/uploads/books.jpg',
    status: 'donate',
    createdAt: Date.now(),
  },
]

describe('useShare', () => {
  let useShare: typeof import('../composables/useShare').useShare

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('../composables/useShare')
    useShare = module.useShare
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('formatItemsList', () => {
    it('formats donate items list correctly', () => {
      const { formatItemsList } = useShare()
      const result = formatItemsList(mockItems, 'donate')

      expect(result).toContain('Items to Donate')
      expect(result).toContain('1. Old Chair')
      expect(result).toContain('2. Vintage Lamp')
      expect(result).toContain('3. Books')
      expect(result).toContain('Total: 3 items')
    })

    it('formats sell items list correctly', () => {
      const { formatItemsList } = useShare()
      const sellItems = mockItems.map((item) => ({ ...item, status: 'sell' }))
      const result = formatItemsList(sellItems, 'sell')

      expect(result).toContain('Items for Sale')
      expect(result).toContain('1. Old Chair')
      expect(result).toContain('Total: 3 items')
    })

    it('handles single item correctly', () => {
      const { formatItemsList } = useShare()
      const result = formatItemsList([mockItems[0]!], 'donate')

      expect(result).toContain('Total: 1 item')
    })

    it('handles empty list', () => {
      const { formatItemsList } = useShare()
      const result = formatItemsList([], 'donate')

      expect(result).toContain('Items to Donate')
      expect(result).toContain('Total: 0 items')
    })
  })

  describe('canUseNativeShare', () => {
    it('returns true when navigator.share is available', () => {
      Object.defineProperty(navigator, 'share', {
        value: vi.fn(),
        writable: true,
        configurable: true,
      })

      vi.resetModules()
      // Re-import to get fresh detection
      return import('../composables/useShare').then((module) => {
        const { canUseNativeShare } = module.useShare()
        expect(canUseNativeShare).toBe(true)
      })
    })

    it('returns false when navigator.share is not available', () => {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      vi.resetModules()
      return import('../composables/useShare').then((module) => {
        const { canUseNativeShare } = module.useShare()
        expect(canUseNativeShare).toBe(false)
      })
    })
  })

  describe('shareItems', () => {
    it('shows info toast when items list is empty', async () => {
      const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn() }
      vi.doMock('../composables/useToast', () => ({
        useToast: () => mockToast,
      }))

      vi.resetModules()
      const module = await import('../composables/useShare')
      const { shareItems } = module.useShare()

      await shareItems([], 'donate', 'copy')

      expect(mockToast.info).toHaveBeenCalledWith('No items to share')
    })

    it('copies to clipboard when method is copy', async () => {
      const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) }
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true,
      })

      const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn() }
      vi.doMock('../composables/useToast', () => ({
        useToast: () => mockToast,
      }))

      vi.resetModules()
      const module = await import('../composables/useShare')
      const { shareItems } = module.useShare()

      await shareItems(mockItems, 'donate', 'copy')

      expect(mockClipboard.writeText).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith('List copied to clipboard')
    })

    it('shows error toast when clipboard fails', async () => {
      const mockClipboard = {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
      }
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true,
      })

      const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn() }
      vi.doMock('../composables/useToast', () => ({
        useToast: () => mockToast,
      }))

      vi.resetModules()
      const module = await import('../composables/useShare')
      const { shareItems } = module.useShare()

      await shareItems(mockItems, 'donate', 'copy')

      expect(mockToast.error).toHaveBeenCalledWith('Failed to copy to clipboard')
    })
  })
})
