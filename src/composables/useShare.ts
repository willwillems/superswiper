import { useToast } from './useToast'
import type { Item } from './useItems'

export type ShareableCategory = 'donate' | 'sell'

export function useShare() {
  const toast = useToast()

  function formatItemsList(items: Item[], category: ShareableCategory): string {
    const emoji = category === 'donate' ? '🎁' : '💰'
    const title = category === 'donate' ? 'Items to Donate' : 'Items for Sale'
    const lines = [
      `${emoji} ${title}`,
      '',
      ...items.map((item, i) => `${i + 1}. ${item.name}`),
      '',
      `Total: ${items.length} item${items.length === 1 ? '' : 's'}`,
    ]
    return lines.join('\n')
  }

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  async function shareViaWebShare(
    items: Item[],
    category: ShareableCategory
  ): Promise<boolean> {
    if (!navigator.share) return false

    const title = category === 'donate' ? 'Items to Donate' : 'Items for Sale'
    const text = formatItemsList(items, category)

    try {
      await navigator.share({ title, text })
      return true
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return true
      }
      return false
    }
  }

  async function shareItems(
    items: Item[],
    category: ShareableCategory,
    method: 'native' | 'copy'
  ): Promise<void> {
    if (items.length === 0) {
      toast.info('No items to share')
      return
    }

    if (method === 'native') {
      const success = await shareViaWebShare(items, category)
      if (!success) {
        const text = formatItemsList(items, category)
        const copied = await copyToClipboard(text)
        if (copied) {
          toast.success('List copied to clipboard')
        } else {
          toast.error('Failed to share')
        }
      }
    } else {
      const text = formatItemsList(items, category)
      const copied = await copyToClipboard(text)
      if (copied) {
        toast.success('List copied to clipboard')
      } else {
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  const canUseNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return {
    shareItems,
    formatItemsList,
    canUseNativeShare,
  }
}
