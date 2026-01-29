import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'superswiper-sound-enabled'

function getStoredSoundEnabled(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored !== 'false'
}

const soundEnabled = ref(getStoredSoundEnabled())

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function ensureAudioContextResumed() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  attack = 0.01,
  decay = 0.1
) {
  if (!soundEnabled.value) return

  const ctx = ensureAudioContextResumed()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack)
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + attack + decay)
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

function playSwipeSound() {
  if (!soundEnabled.value) return

  const ctx = ensureAudioContextResumed()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(300, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.1)
}

function playKeepSound() {
  if (!soundEnabled.value) return

  playTone(523.25, 0.15, 'sine', 0.25, 0.01, 0.05)
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25, 0.01, 0.05), 80)
  setTimeout(() => playTone(783.99, 0.2, 'sine', 0.3, 0.01, 0.08), 160)
}

function playDiscardSound() {
  if (!soundEnabled.value) return

  playTone(400, 0.12, 'triangle', 0.2, 0.01, 0.05)
  setTimeout(() => playTone(300, 0.15, 'triangle', 0.2, 0.01, 0.08), 60)
}

function playCelebrationSound() {
  if (!soundEnabled.value) return

  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.2, 0.01, 0.1), i * 100)
  })
  setTimeout(() => {
    playTone(1318.51, 0.4, 'sine', 0.25, 0.01, 0.15)
  }, 400)
}

function playUndoSound() {
  if (!soundEnabled.value) return

  playTone(500, 0.1, 'sine', 0.2, 0.01, 0.05)
  setTimeout(() => playTone(400, 0.15, 'sine', 0.2, 0.01, 0.08), 80)
}

function playUploadSound() {
  if (!soundEnabled.value) return

  playTone(440, 0.08, 'sine', 0.15, 0.01, 0.03)
  setTimeout(() => playTone(554.37, 0.12, 'sine', 0.2, 0.01, 0.05), 60)
}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, String(soundEnabled.value))
})

export function useSound() {
  function setSoundEnabled(enabled: boolean) {
    soundEnabled.value = enabled
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playSwipeSound,
    playKeepSound,
    playDiscardSound,
    playCelebrationSound,
    playUndoSound,
    playUploadSound,
  }
}
