import React, {useEffect, useMemo, useState} from 'react'
import {createRoot, Root} from 'react-dom/client'
import {defineConfig, type DocumentActionComponent} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media} from 'sanity-plugin-media'
import {visionTool} from '@sanity/vision'
import deskStructure from './deskStructure'
import {schemaTypes} from './schemas'

import {
  Badge, Box, Button, Card, Checkbox, Flex, Grid, Inline, Stack, Text, TextInput, ThemeProvider, studioTheme,
} from '@sanity/ui'

export default defineConfig({
  name: 'okinawan-kempo-studio',
  title: 'Okinawan Kempo Studio',
  projectId: 'pg5jco5w',
  dataset: 'production',
  plugins: [structureTool({ structure: deskStructure }),media(), visionTool()],

 document: {
  // ukryj "New document" dla singletona
  newDocumentOptions: (prev) =>
    prev.filter((t) => t.templateId !== 'socialLinks'),

  actions: (prev, ctx) => {
    // 🔹 singleton: filtr akcji
    if (ctx.schemaType === 'socialLinks') {
      return prev.filter((a) => !['duplicate', 'unpublish', 'delete'].includes(a.action))
    }

    // 🔹 Twój custom action dla albumów – NIE ruszamy
    if (ctx.schemaType === 'album') {
      const AddFromTagAction: DocumentActionComponent = (props) => {
        const client = ctx.getClient({apiVersion: '2024-11-01'})
        const currentId = String(props.id ?? props.draftId ?? props.publishedId ?? '')
        const baseId = currentId.replace(/^drafts\./, '')
        const draftId = `drafts.${baseId}`

        function openOverlay() {
          const w = window as any
          if (w.__pickFromTagOpen) return
          w.__pickFromTagOpen = true
          if (!w.__pickFromTagRootEl) {
            const el = document.createElement('div')
            el.id = 'pick-from-tag-root'
            el.style.position = 'fixed'
            el.style.inset = '0'
            el.style.zIndex = '9999'
            el.style.display = 'none'
            el.style.pointerEvents = 'none'
            el.setAttribute('aria-hidden', 'true')
            document.body.appendChild(el)
            w.__pickFromTagRootEl = el
            w.__pickFromTagRoot = createRoot(el)
          }
          const root: Root = (w.__pickFromTagRoot as Root)
          const el: HTMLElement = w.__pickFromTagRootEl as HTMLElement

          const handleClose = () => {
            root.render(<></>)
            el.style.display = 'none'
            el.style.pointerEvents = 'none'
            el.setAttribute('aria-hidden', 'true')
            w.__pickFromTagOpen = false
          }
          const handleComplete = () => {
            root.render(<></>)
            el.style.display = 'none'
            el.style.pointerEvents = 'none'
            el.setAttribute('aria-hidden', 'true')
            w.__pickFromTagOpen = false
            props.onComplete?.()
          }

          el.style.display = 'block'
          el.style.pointerEvents = 'auto'
          el.removeAttribute('aria-hidden')

          root.render(
            <ThemeProvider theme={studioTheme} scheme="dark">
              <PickFromTagOverlay
                client={client}
                draftId={draftId}
                onClose={handleClose}
                onComplete={handleComplete}
              />
            </ThemeProvider>
          )
          setTimeout(() => el.focus?.(), 0)
        }

        return {
          id: 'pick-from-tag',
          label: 'Dodaj z tagu (podgląd)…',
          onHandle: () => openOverlay(),
        }
      }

      return [...prev, AddFromTagAction]
    }

    // default
    return prev
  },
},

  schema: {types: schemaTypes},
})

/** ---------------- Overlay fullscreen ---------------- */
function PickFromTagOverlay({
  client,
  draftId,
  onClose,
  onComplete,
}: {
  client: any
  draftId: string
  onClose?: () => void
  onComplete?: () => void
}) {
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assets, setAssets] = useState<{_id: string; url?: string; originalFilename?: string}[]>([])
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [existing, setExisting] = useState<string[]>([])

  // UI controls
  const [thumb, setThumb] = useState(260) // default cell width
  const [fit, setFit] = useState<'cover' | 'contain'>('cover')
  const [showNames, setShowNames] = useState(true)

  // close on ESC and on backdrop click
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Ensure draft and load existing refs
  useEffect(() => {
    ;(async () => {
      await client.createIfNotExists({_id: draftId, _type: 'album'})
      const refs: string[] =
        (await client.fetch(`coalesce(*[_id==$id][0].photos[].asset._ref, [])`, {id: draftId})) ?? []
      setExisting(refs)
    })()
  }, [client, draftId])

  const selectedIds = useMemo(() => Object.entries(checked).filter(([, v]) => v).map(([k]) => k), [checked])
  const canAdd = selectedIds.length > 0 && !loading
  const cdnFit = fit === 'contain' ? 'max' : 'crop'

  async function findByTag() {
    setError(null)
    setLoading(true)
    try {
      const s = tag.trim().toLowerCase()
      const tagDoc = await client.fetch(
        `*[_type in ["media.tag","sanity.tag"] && lower(name.current)==$s][0]{_id}`,
        {s}
      )
      if (!tagDoc?._id) {
        setAssets([])
        setChecked({})
        setError(`Nie znaleziono taga "${tag}"`)
        return
      }
      const tagId = String(tagDoc._id).replace(/^drafts\./, '')
      const res =
        (await client.fetch(
          `*[_type=="sanity.imageAsset" && $tagId in coalesce(opt.media.tags[]._ref, [])]{ _id, url, originalFilename }[0...500]`,
          {tagId}
        )) ?? []
      setAssets(res)

      const init: Record<string, boolean> = {}
      res.forEach((a: any) => { if (!existing.includes(a._id)) init[a._id] = true })
      setChecked(init)
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  async function addSelected() {
    setLoading(true)
    try {
      const ids = selectedIds.filter((id) => !existing.includes(id))
      if (!ids.length) {
        onClose?.()
        return
      }
      const photos = ids.map((_id) => ({_type: 'image', asset: {_type: 'reference', _ref: _id}}))
      const has = await client.fetch(`defined(*[_id==$id][0].photos[0])`, {id: draftId})
      const patch = client.patch(draftId).setIfMissing({photos: []})
      has ? patch.insert('after', 'photos[-1]', photos) : patch.set({photos})
      await patch.commit({autoGenerateArrayKeys: true})
      onComplete?.()
      onClose?.()
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  // Backdrop + centered container sized to viewport with comfortable bounds
  return (
    <div
      tabIndex={-1}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '4vh 4vw',
      }}
    >
      <div
        style={{
          width: 'min(92vw, 1400px)',
          height: 'min(88vh, 900px)',
          background: '#0d0d0d', color: '#fff',
          border: '1px solid #262626', borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid #1f1f1f'}}>
          <Text size={2} weight="semibold">Dodaj zdjęcia z tagu</Text>
          <button
            onClick={() => onClose?.()}
            aria-label="Zamknij"
            style={{background:'#1e1e1e', border:'1px solid #444', color:'#ddd',
                    fontSize:14, borderRadius:6, padding:'6px 10px', cursor:'pointer'}}>
            Zamknij (Esc)
          </button>
        </div>

        {/* Controls */}
        <div style={{display:'flex', gap:12, alignItems:'center', padding:'10px 14px', borderBottom:'1px solid #1f1f1f', flexWrap:'wrap'}}>
          <Text size={1}>Tag</Text>
          <TextInput value={tag} onChange={(e)=>setTag(e.currentTarget.value)} placeholder="np. 2024/seminar/taika" style={{minWidth:280}} />
          <Button text="Szukaj" tone="primary" onClick={findByTag} disabled={loading || !tag.trim()} />
          {loading && <Text muted>Ładowanie…</Text>}
          <div style={{marginLeft:'auto', display:'flex', gap:12, alignItems:'center'}}>
            <label style={{display:'flex', alignItems:'center', gap:6}}>
              <Text size={1} muted>Rozmiar</Text>
              <input type="range" min={160} max={420} step={10} value={thumb} onChange={(e)=>setThumb(Number(e.currentTarget.value))} />
            </label>
            <label style={{display:'flex', alignItems:'center', gap:6}}>
              <Text size={1} muted>Dopasowanie</Text>
              <select value={fit} onChange={(e)=>setFit(e.currentTarget.value as 'cover'|'contain')} style={{background:'#111', color:'#fff', border:'1px solid #333', borderRadius:6, padding:'6px 8px'}}>
                <option value="contain">całe zdjęcie</option>
                <option value="cover">wypełnij</option>
              </select>
            </label>
            <label style={{display:'flex', alignItems:'center', gap:6}}>
              <input type="checkbox" checked={showNames} onChange={(e)=>setShowNames(e.currentTarget.checked)} />
              <Text size={1} muted>pokaż nazwę</Text>
            </label>
            <Badge mode="outline">Razem: {assets.length}</Badge>
            <Badge mode="outline" tone="primary">Wybrane: {selectedIds.length}</Badge>
          </div>
        </div>

        {/* Grid */}
        <div style={{flex:1, overflow:'auto', padding:'12px 14px'}}>
          <div style={{display:'grid', gridTemplateColumns:`repeat(auto-fill, minmax(${thumb}px, 1fr))`, gap:12, alignItems:'stretch'}}>
            {assets.map((a) => {
              const selected = !!checked[a._id]
              const inAlbum = existing.includes(a._id)
              const cellH = Math.round(thumb * 0.66)
              return (
                <div
                  key={a._id}
                  onClick={() => setChecked((prev)=>({...prev, [a._id]: !prev[a._id]}))}
                  style={{
                    position:'relative', height: cellH + (showNames ? 28 : 0),
                    border:`2px solid ${selected ? '#00c4ff' : '#2a2a2a'}`,
                    borderRadius:10, overflow:'hidden', cursor:'pointer',
                    background: fit==='contain' ? 'repeating-conic-gradient(#1a1a1a 0% 25%, #141414 0% 50%) 50% / 12px 12px' : '#0f0f0f',
                  }}
                >
                  <div style={{position:'absolute', top:8, right:8, zIndex:2}}>
                    <Checkbox checked={selected} onChange={(e)=>{ e.stopPropagation(); setChecked((prev)=>({...prev, [a._id]: e.currentTarget.checked})) }} />
                  </div>
                  {a.url ? (
                    <img
                      src={`${a.url}?w=${Math.round(thumb*3)}&h=${Math.round(cellH*3)}&fit=${cdnFit}&auto=format&dpr=2`}
                      alt={a.originalFilename ?? ''}
                      loading="lazy"
                      style={{
                        width:'100%', height:cellH, objectFit: fit, objectPosition:'center', display:'block',
                        imageRendering: 'auto', backgroundColor: '#111'
                      }}
                    />
                  ) : (
                    <Flex align="center" justify="center" style={{height:cellH}}>
                      <Text size={1} muted>Brak podglądu</Text>
                    </Flex>
                  )}
                  {showNames && (
                    <div style={{padding:'6px 8px', display:'flex', gap:8, alignItems:'center'}}>
                      {inAlbum && (<span style={{fontSize:10, padding:'2px 6px', border:'1px solid #444', borderRadius:6}}>w albumie</span>)}
                      <Text size={1} muted style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {a.originalFilename ?? a._id}
                      </Text>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:'10px 14px', borderTop:'1px solid #1f1f1f', display:'flex', justifyContent:'flex-end', gap:8}}>
          <Button text="Wyczyść zaznaczenia" onClick={()=>setChecked({})} />
          <Button text={`Dodaj ${selectedIds.length} zdjęć`} tone="primary" disabled={!canAdd} onClick={addSelected} />
        </div>
      </div>
    </div>
  )
}