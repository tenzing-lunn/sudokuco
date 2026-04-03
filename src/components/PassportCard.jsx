import React from 'react'

function formatTime(s) {
  if (!s && s !== 0) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const DIFFICULTIES = ['easy', 'medium', 'hard']
const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const SIZE_EMOJI = { 4: '🌱', 6: '🌸', 8: '🌺', 9: '🏆' }

export default function PassportCard({ size, records }) {
  const totalCompleted = records.length
  const locked = totalCompleted === 0

  const statsByDiff = DIFFICULTIES.reduce((acc, diff) => {
    const group = records.filter(r => r.difficulty === diff)
    const count = group.length
    const bestTime = count > 0 ? Math.min(...group.map(r => r.timeSeconds)) : null
    const avgHints = count > 0
      ? Math.round(group.reduce((s, r) => s + r.hintsUsed, 0) / count * 10) / 10
      : null
    acc[diff] = { count, bestTime, avgHints }
    return acc
  }, {})

  return (
    <div className={`passport-card${locked ? ' passport-card--locked' : ''}`}>
      <div className="passport-card__header">
        <span className="passport-card__emoji">{locked ? '🔒' : SIZE_EMOJI[size]}</span>
        <h3 className="passport-card__title">{size}×{size}</h3>
        <span className="passport-card__total">
          {locked ? 'Not started' : `${totalCompleted} solved`}
        </span>
      </div>

      {!locked && (
        <div className="passport-card__table">
          <div className="passport-card__row passport-card__row--header">
            <span></span>
            <span>Solved</span>
            <span>Best</span>
            <span>Avg hints</span>
          </div>
          {DIFFICULTIES.map(diff => {
            const s = statsByDiff[diff]
            return (
              <div key={diff} className="passport-card__row">
                <span className={`passport-card__diff passport-card__diff--${diff}`}>
                  {DIFF_LABEL[diff]}
                </span>
                <span>{s.count || '—'}</span>
                <span>{formatTime(s.bestTime)}</span>
                <span>{s.avgHints ?? '—'}</span>
              </div>
            )
          })}
        </div>
      )}

      {locked && (
        <p className="passport-card__locked-msg">
          Complete a {size}×{size} puzzle to unlock your stats!
        </p>
      )}
    </div>
  )
}
