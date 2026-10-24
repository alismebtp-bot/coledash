import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { MENU_SCROLL_OFFSET, sectionDomId } from './utils'

export interface NavSection {
  id: string
  label: string
  count: number
}

/** Sticky horizontal category nav that highlights the section in view. */
export default function MenuCategoryNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const listRef = useRef<HTMLDivElement>(null)
  const lockUntil = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return
      let current = sections[0]?.id ?? ''
      for (const s of sections) {
        const el = document.getElementById(sectionDomId(s.id))
        if (el && el.getBoundingClientRect().top - MENU_SCROLL_OFFSET - 8 <= 0) current = s.id
      }
      // Bottom of the page: last section wins.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id ?? current
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sections])

  // Keep the active chip visible in the horizontal list.
  useEffect(() => {
    const list = listRef.current
    const chip = list?.querySelector<HTMLElement>(`[data-section="${active}"]`)
    if (list && chip) {
      const left = chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2
      list.scrollTo({ left, behavior: 'smooth' })
    }
  }, [active])

  const goTo = (id: string) => {
    const el = document.getElementById(sectionDomId(id))
    if (!el) return
    setActive(id)
    lockUntil.current = Date.now() + 700
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - MENU_SCROLL_OFFSET + 4, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <nav
      aria-label="Catégories du menu"
      className="sticky top-16 z-30 -mx-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:mx-0 sm:px-0"
    >
      <div ref={listRef} className="relative overflow-x-auto scrollbar-none">
        <ul className="flex w-max gap-1 py-3">
          {sections.map((s) => {
            const isActive = s.id === active
            return (
              <li key={s.id}>
                <a
                  href={`#${sectionDomId(s.id)}`}
                  data-section={s.id}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(s.id)
                  }}
                  className={cn(
                    'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors',
                    isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-secondary hover:text-ink',
                  )}
                >
                  {s.label}
                  <span className={cn('text-xs font-medium', isActive ? 'text-white/60' : 'text-muted-foreground')}>{s.count}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
