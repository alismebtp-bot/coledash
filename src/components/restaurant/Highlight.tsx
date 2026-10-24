import { Fragment } from 'react'

/** Strip accents char by char, keeping a map back to the original indexes. */
function foldWithMap(text: string) {
  let folded = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    const f = text[i].normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    for (let j = 0; j < f.length; j++) {
      folded += f[j]
      map.push(i)
    }
  }
  return { folded, map }
}

/** Highlights every (accent-insensitive) occurrence of the query words. */
export default function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)
  if (tokens.length === 0) return <>{text}</>

  const { folded, map } = foldWithMap(text)
  const marks = new Array<boolean>(text.length).fill(false)
  for (const t of tokens) {
    let from = 0
    let idx = folded.indexOf(t, from)
    while (idx !== -1) {
      for (let k = idx; k < idx + t.length; k++) marks[map[k]] = true
      from = idx + t.length
      idx = folded.indexOf(t, from)
    }
  }

  const parts: { text: string; mark: boolean }[] = []
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1]
    if (last && last.mark === marks[i]) last.text += text[i]
    else parts.push({ text: text[i], mark: marks[i] })
  }
  return (
    <>
      {parts.map((p, i) =>
        p.mark ? (
          <mark key={i} className="rounded-sm bg-brand-100 px-0.5 text-inherit">
            {p.text}
          </mark>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  )
}
