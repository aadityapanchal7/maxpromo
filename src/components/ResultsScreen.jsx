import { useEffect, useId, useState } from 'react'
import styles from './ResultsScreen.module.css'

/** App-Store-style mark (original artwork; not Apple’s asset). */
function AppStoreLikeIcon() {
  const gid = useId().replace(/:/g, '')
  return (
    <svg className={styles.maxAppIcon} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="10" y1="6" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5ab0ff" />
          <stop offset="1" stopColor="#0a6eff" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="11" fill={`url(#${gid})`} />
      <path
        d="M15 33.5L24 13l9 20.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 26h11"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ResultsScreen({ data, onBack }) {
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    if (!data?.imageFile || !data.imageFile.type?.startsWith('image/')) {
      setImageSrc(null)
      return
    }
    const url = URL.createObjectURL(data.imageFile)
    setImageSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [data?.imageFile])

  const hasImage = Boolean(imageSrc)
  const modules = data?.modules?.length ? data.modules : []
  const ratingColor =
    typeof data?.ratingColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(data.ratingColor)
      ? data.ratingColor
      : '#c62828'

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Back to form">
          <BackIcon />
        </button>
        <h1 className={styles.title}>Your results</h1>
      </header>

      <p className={styles.sectionLabel}>AI facial analysis</p>

      <div className={styles.avatarWrap}>
        {hasImage ? (
          <img className={styles.avatar} src={imageSrc} alt="" />
        ) : (
          <div className={`${styles.avatar} ${styles.avatarPlaceholder}`}>No photo</div>
        )}
      </div>

      <div className={styles.scoreRow}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreCap}>Rating</span>
          <span className={styles.scoreValue} style={{ color: ratingColor }}>
            {data.rating}
          </span>
          <span className={styles.scoreSuffix}>/10</span>
        </div>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreCap}>Potential</span>
          <span className={styles.scoreValue}>{data.potential}</span>
          <span className={styles.scoreSuffix}>/10</span>
        </div>
      </div>

      <div className={styles.maxAppBanner}>
        <AppStoreLikeIcon />
        <span className={styles.maxAppText}>Max App</span>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Tier</span>
          <span className={styles.metricValue}>{data.tier}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Appeal</span>
          <span className={`${styles.metricValue} ${styles.metricValueAppeal}`}>{data.appeal}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Archetype</span>
          <span className={styles.metricValue}>{data.archetype}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Ascension time</span>
          <span className={styles.metricValue}>{data.ascension}</span>
        </div>
        <div className={`${styles.metric} ${styles.metricFull}`}>
          <span className={styles.metricLabel}>Facial age (look)</span>
          <span className={styles.metricValue}>{data.facialAge}</span>
        </div>
      </div>

      <div className={styles.suggested}>
        <p className={styles.sectionLabel}>Suggested modules</p>
        <div className={styles.suggestedInner}>
          {modules.length === 0 ? (
            <span className={styles.emptyModules}>None selected</span>
          ) : (
            modules.map((name) => (
              <span key={name} className={styles.tag}>
                {name}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
