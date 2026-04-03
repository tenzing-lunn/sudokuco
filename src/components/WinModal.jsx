import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default function WinModal({ puzzle, elapsed, onNewGame }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window.confetti !== 'function') return
    const end = Date.now() + 3000
    const colors = ['#F2789F', '#C5B8F5', '#A8E6CF', '#FFD97D', '#FDE8F0']
    const frame = () => {
      window.confetti({ particleCount: 4, angle: 60,  spread: 60, origin: { x: 0 },   colors })
      window.confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 },   colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__emoji" aria-hidden="true">🎉</div>
        <h2 className="modal__title">You solved it!</h2>
        <p className="modal__subtitle">
          {puzzle.size}×{puzzle.size} · <span className={`modal__diff modal__diff--${puzzle.difficulty}`}>{DIFF_LABEL[puzzle.difficulty]}</span>
        </p>
        <div className="modal__stats">
          <div className="modal__stat modal__stat--time">
            <span className="modal__stat-icon">⏱</span>
            <span className="modal__stat-value">{formatTime(elapsed)}</span>
            <span className="modal__stat-label">Time</span>
          </div>
          <div className="modal__stat modal__stat--hints">
            <span className="modal__stat-icon">💡</span>
            <span className="modal__stat-value">{puzzle.hintsUsed}</span>
            <span className="modal__stat-label">Hints</span>
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--primary btn--large" onClick={onNewGame}>
            Play Again
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/passport')}>
            🛂 Passport
          </button>
        </div>
      </div>
    </div>
  )
}
