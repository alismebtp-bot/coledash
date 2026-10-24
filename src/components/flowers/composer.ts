import { flowerCatalog, palettes, vaseOptions, wrappingOptions, type FlowerItem } from '@/data/flowerCatalog'
import { colorDistance } from './color'

export const MAX_STEMS = 40
export const MIN_STEMS = 5
export const COMPOSITION_FEE = 5

export interface Composition {
  stems: Record<string, number>
  wrapId: string
  vaseId: string
  message: string
}

export const EMPTY_COMPOSITION: Composition = { stems: {}, wrapId: wrappingOptions[0].id, vaseId: 'none', message: '' }

export function stemCount(c: Composition): number {
  return Object.values(c.stems).reduce((a, b) => a + b, 0)
}

export function chosenFlowers(c: Composition): { item: FlowerItem; count: number }[] {
  return flowerCatalog.filter((f) => (c.stems[f.id] ?? 0) > 0).map((item) => ({ item, count: c.stems[item.id] }))
}

export function pricing(c: Composition) {
  const lines = chosenFlowers(c).map(({ item, count }) => ({ id: item.id, label: item.nameFr, count, unit: item.stemPrice, total: item.stemPrice * count }))
  const flowers = lines.reduce((a, l) => a + l.total, 0)
  const wrap = wrappingOptions.find((w) => w.id === c.wrapId) ?? wrappingOptions[0]
  const vase = vaseOptions.find((v) => v.id === c.vaseId) ?? vaseOptions[0]
  const count = stemCount(c)
  const fee = count > 0 ? COMPOSITION_FEE : 0
  const total = Math.round((flowers + (count > 0 ? wrap.price + vase.price : 0) + fee) * 100) / 100
  return { lines, flowers, wrap, vase, fee, total, count }
}

/** Short stable hash (djb2) of the composition, used as cart product id. */
export function compositionHash(c: Composition): string {
  const key = JSON.stringify([
    Object.entries(c.stems)
      .filter(([, v]) => v > 0)
      .sort(([a], [b]) => a.localeCompare(b)),
    c.wrapId,
    c.vaseId,
    c.message.trim(),
  ])
  let h = 5381
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

/** Builds a starting composition matching a palette: nearest bloom per colour + greenery. */
export function compositionFromPalette(paletteId: string, base: Composition): Composition {
  const palette = palettes.find((p) => p.id === paletteId)
  if (!palette) return base
  const blooms = flowerCatalog.filter((f) => f.category !== 'greenery' && f.category !== 'filler')
  const picked = new Set<string>()
  const stems: Record<string, number> = {}
  palette.colors.forEach((color, i) => {
    const best = blooms
      .filter((f) => !picked.has(f.id))
      .sort((a, b) => colorDistance(a.color, color) - colorDistance(b.color, color))[0]
    if (best) {
      picked.add(best.id)
      stems[best.id] = i === 0 ? 5 : i === 1 ? 4 : 3
    }
  })
  stems.eucalyptus = 3
  stems['baby-breath'] = 2
  return { ...base, stems }
}

export function paletteMatches(c: Composition, paletteId: string): number {
  const palette = palettes.find((p) => p.id === paletteId)
  if (!palette) return 0
  const blooms = chosenFlowers(c).filter(({ item }) => item.category !== 'greenery' && item.category !== 'filler')
  if (!blooms.length) return 0
  const near = blooms.filter(({ item }) => palette.colors.some((col) => colorDistance(col, item.color) < 160))
  return near.reduce((a, b) => a + b.count, 0) / blooms.reduce((a, b) => a + b.count, 0)
}

export function summaryLabels(c: Composition): string[] {
  const { wrap, vase, count } = pricing(c)
  const labels = [`${count} tiges`, ...chosenFlowers(c).map(({ item, count }) => `${count} × ${item.nameFr}`), `Emballage : ${wrap.name}`]
  labels.push(vase.id === 'none' ? 'Sans vase' : `Vase : ${vase.name}`)
  if (c.message.trim()) labels.push(`Carte : « ${c.message.trim()} »`)
  return labels
}
