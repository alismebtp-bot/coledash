/** Tiny colour helpers for the hand-drawn flower illustrations. */

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`
}

export function mix(a: string, b: string, amount: number): string {
  const x = toRgb(a)
  const y = toRgb(b)
  return toHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * amount) as [number, number, number])
}

/** Negative amount darkens (towards ink), positive lightens. */
export function shade(color: string, amount: number): string {
  return amount < 0 ? mix(color, '#1c1917', -amount) : mix(color, '#ffffff', amount)
}

export function colorDistance(a: string, b: string): number {
  const x = toRgb(a)
  const y = toRgb(b)
  // Weighted euclidean distance, good enough for picking a nearest flower.
  return Math.sqrt(2 * (x[0] - y[0]) ** 2 + 4 * (x[1] - y[1]) ** 2 + 3 * (x[2] - y[2]) ** 2)
}

/** True for very pale colours that need a visible outline on light backgrounds. */
export function isPale(color: string): boolean {
  const [r, g, b] = toRgb(color)
  return 0.299 * r + 0.587 * g + 0.114 * b > 225
}
