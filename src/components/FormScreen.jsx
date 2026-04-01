import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './FormScreen.module.css'

const MODULE_OPTIONS = ['skinmax', 'bonemax', 'fitmax', 'hairmax']

const defaultModules = () => new Set(MODULE_OPTIONS)

export default function FormScreen({ onSubmit }) {
  const inputId = useId()
  const fileRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [lastFile, setLastFile] = useState(null)

  const [rating, setRating] = useState('4.8')
  const [ratingColor, setRatingColor] = useState('#e53935')
  const [ratingHexDraft, setRatingHexDraft] = useState('#e53935')
  const [potential, setPotential] = useState('8.5')
  const [tier, setTier] = useState('MTN')
  const [appeal, setAppeal] = useState('6.0/10')
  const [archetype, setArchetype] = useState('Exotic')
  const [ascension, setAscension] = useState('10 months')
  const [facialAge, setFacialAge] = useState('17')
  const [modules, setModules] = useState(defaultModules)

  const revokePreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const applyFile = useCallback(
    (file) => {
      revokePreview()
      setLastFile(null)
      if (!file || !file.type?.startsWith('image/')) {
        if (fileRef.current) fileRef.current.value = ''
        return
      }
      setLastFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      try {
        const dt = new DataTransfer()
        dt.items.add(file)
        if (fileRef.current) fileRef.current.files = dt.files
      } catch {
        /* input.files may be read-only in some environments */
      }
    },
    [revokePreview]
  )

  useEffect(() => () => revokePreview(), [revokePreview])

  const onFileChange = (e) => {
    const f = e.target.files?.[0]
    applyFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f?.type?.startsWith('image/')) applyFile(f)
  }

  const toggleModule = (name) => {
    setModules((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0] || lastFile || null
    onSubmit({
      rating: rating.trim() || '—',
      potential: potential.trim() || '—',
      tier: tier.trim() || '—',
      appeal: appeal.trim() || '—',
      archetype: archetype.trim() || '—',
      ascension: ascension.trim() || '—',
      facialAge: facialAge.trim() || '—',
      modules: MODULE_OPTIONS.filter((m) => modules.has(m)),
      imageFile: file,
      ratingColor,
    })
  }

  const applyRatingColor = (hex) => {
    setRatingColor(hex)
    setRatingHexDraft(hex)
  }

  const onRatingHexBlur = () => {
    const v = ratingHexDraft.trim()
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) applyRatingColor(v.toLowerCase())
    else setRatingHexDraft(ratingColor)
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.heading}>Build your results</h1>
      <p className={styles.hint}>
        Fill in the fields. Photos stay in this tab only (object URLs)—nothing is uploaded or stored on a server.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Profile photo</span>
          <label
            className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileRef}
              id={inputId}
              className={styles.hiddenInput}
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            {!previewUrl && <span className={styles.uploadText}>Tap to choose an image</span>}
            {previewUrl && <img className={styles.preview} src={previewUrl} alt="" />}
          </label>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="rating">
              Rating
            </label>
            <input
              id="rating"
              className={styles.input}
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="potential">
              Potential
            </label>
            <input
              id="potential"
              className={styles.input}
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={potential}
              onChange={(e) => setPotential(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Rating color</span>
          <div className={styles.colorRow}>
            <input
              id="rating-color"
              className={styles.colorPicker}
              type="color"
              value={ratingColor}
              onChange={(e) => applyRatingColor(e.target.value)}
              aria-label="Pick rating color"
            />
            <input
              className={styles.hexInput}
              type="text"
              value={ratingHexDraft}
              onChange={(e) => setRatingHexDraft(e.target.value)}
              onBlur={onRatingHexBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
              spellCheck={false}
              maxLength={7}
              placeholder="#e53935"
              aria-label="Rating color hex"
            />
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="tier">
              Tier
            </label>
            <input id="tier" className={styles.input} value={tier} onChange={(e) => setTier(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="appeal">
              Appeal
            </label>
            <input id="appeal" className={styles.input} value={appeal} onChange={(e) => setAppeal(e.target.value)} />
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="archetype">
              Archetype
            </label>
            <input
              id="archetype"
              className={styles.input}
              value={archetype}
              onChange={(e) => setArchetype(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ascension">
              Ascension time
            </label>
            <input
              id="ascension"
              className={styles.input}
              value={ascension}
              onChange={(e) => setAscension(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="facialAge">
            Facial age (look)
          </label>
          <input
            id="facialAge"
            className={styles.input}
            value={facialAge}
            onChange={(e) => setFacialAge(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Suggested modules</span>
          <div className={styles.modules}>
            {MODULE_OPTIONS.map((name) => (
              <label key={name} className={styles.moduleCheck}>
                <input
                  type="checkbox"
                  checked={modules.has(name)}
                  onChange={() => toggleModule(name)}
                />
                {name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Show results
        </button>
      </form>
    </div>
  )
}
