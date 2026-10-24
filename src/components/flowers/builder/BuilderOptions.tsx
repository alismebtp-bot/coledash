import { Check } from 'lucide-react'
import { palettes, vaseOptions, wrappingOptions } from '@/data/flowerCatalog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { shade } from '../color'
import { paletteMatches, type Composition } from '../composer'

const optionClass = (active: boolean) =>
  cn(
    'relative flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    active ? 'border-ink shadow-soft ring-1 ring-ink' : 'hover:border-ink/30',
  )

function Tick({ show }: { show: boolean }) {
  return show ? (
    <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white">
      <Check className="h-3.5 w-3.5" aria-hidden />
    </span>
  ) : null
}

export function PaletteStep({ composition, onApply }: { composition: Composition; onApply: (id: string) => void }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Choisissez une harmonie : nous composons une base de fleurs assorties, que vous pourrez ensuite ajuster tige par tige.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {palettes.map((p) => {
          const match = paletteMatches(composition, p.id)
          return (
            <li key={p.id}>
              <button type="button" onClick={() => onApply(p.id)} className={optionClass(false)}>
                <span className="flex -space-x-2" aria-hidden>
                  {p.colors.map((c) => (
                    <span key={c} className="h-8 w-8 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.description}</span>
                  {match > 0.6 && <span className="mt-0.5 block text-xs font-medium text-emerald-700">Votre sélection s’en rapproche</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Appliquer une palette remplace les fleurs déjà choisies.</p>
    </div>
  )
}

export function WrapStep({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Emballage">
      {wrappingOptions.map((w) => (
        <li key={w.id}>
          <button type="button" role="radio" aria-checked={value === w.id} onClick={() => onChange(w.id)} className={optionClass(value === w.id)}>
            <span
              className="h-10 w-10 shrink-0 rounded-xl border"
              style={{ background: `linear-gradient(135deg, ${w.color}, ${shade(w.color, w.color === '#1c1917' ? 0.2 : -0.12)})` }}
              aria-hidden
            />
            <span>
              <span className="block text-sm font-semibold text-ink">{w.name}</span>
              <span className="block text-xs text-muted-foreground">{formatPrice(w.price)}</span>
            </span>
            <Tick show={value === w.id} />
          </button>
        </li>
      ))}
    </ul>
  )
}

const VASE_SWATCH: Record<string, string> = {
  none: 'repeating-linear-gradient(45deg, #f5f5f4, #f5f5f4 4px, #fff 4px, #fff 8px)',
  'glass-cylinder': 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
  'ceramic-white': 'linear-gradient(135deg, #ffffff, #e7e5e4)',
  'ceramic-rose': 'linear-gradient(135deg, #fce7f3, #f9a8d4)',
  'gold-vase': 'linear-gradient(135deg, #b8862f, #f1d18a, #a8741f)',
}

export function VaseStep({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Vase">
      {vaseOptions.map((v) => (
        <li key={v.id}>
          <button type="button" role="radio" aria-checked={value === v.id} onClick={() => onChange(v.id)} className={optionClass(value === v.id)}>
            <span className="h-10 w-8 shrink-0 rounded-b-xl rounded-t-md border" style={{ background: VASE_SWATCH[v.id] }} aria-hidden />
            <span>
              <span className="block text-sm font-semibold text-ink">{v.name}</span>
              <span className="block text-xs text-muted-foreground">{v.price === 0 ? 'Inclus' : `+ ${formatPrice(v.price)}`}</span>
            </span>
            <Tick show={value === v.id} />
          </button>
        </li>
      ))}
    </ul>
  )
}

const IDEAS = ['Joyeux anniversaire !', 'Merci pour tout', 'Je pense fort à toi', 'Bienvenue au monde, petit trésor']
export const MESSAGE_MAX = 200

export function MessageStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label htmlFor="bouquet-message" className="text-sm font-semibold text-ink">
        Votre message <span className="font-normal text-muted-foreground">(facultatif)</span>
      </Label>
      <div className="mt-2 rounded-2xl border bg-[#fffdf8] p-1 shadow-soft">
        <Textarea
          id="bouquet-message"
          value={value}
          maxLength={MESSAGE_MAX}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Écrit à la main par votre fleuriste sur une jolie carte…"
          className="resize-none border-0 bg-transparent font-serif text-lg italic shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Carte offerte</span>
        <span className="tabular-nums">
          {value.length}/{MESSAGE_MAX}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {IDEAS.map((idea) => (
          <button key={idea} type="button" onClick={() => onChange(idea)} className="rounded-full border bg-card px-3 py-1 text-xs text-ink hover:border-ink/40">
            {idea}
          </button>
        ))}
      </div>
    </div>
  )
}
