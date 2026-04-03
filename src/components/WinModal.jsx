import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function WinModal({ puzzle, elapsed, onNewGame }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window.confetti === 'function') {
      const end = Date.now() + 2500
      const frame = () => {
        window.confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#e86fa0', '#c5b8f5', '#ffd6e8', '#b5e8d0'],
        })
        window.confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#e86fa0', '#c5b8f5', '#ffd6e8', '#b5e8d0'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [])

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__emoji">🎉</div>
        <h2 className="modal__title">You solved it!</h2>
        <div className="modal__stats">
          <div className="modal__stat">
            <span className="modal__stat-label">Time</span>
            <span className="modal__stat-value">{formatTime(elapsed)}</span>
          </div>
          <div className="modal__stat">
            <span className="modal__stat-label">Hints</span>
            <span className="modal__stat-value">{puzzle.hintsUsed}</span>
          </div>
          <div className="modal__stat">
            <span className="modal__stat-label">Size</span>
            <span className="modal__stat-value">{puzzle.size}×{puzzle.size}</span>
          </div>
          <div className="modal__stat">
            <span className="modal__stat-label">Difficulty</span>
            <span className="modal__stat-value" style={{ textTransform: 'capitalize' }}>{puzzle.difficulty}</span>
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={onNewGame}>
            New Game
          </button>
          <button className="btn btn--secondary" onClick={() => navigate('/passport')}>
            View Passport
          </button>
        </div>
      </div>
    </div>
  )
}
