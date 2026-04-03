import React from 'react'
import { useNavigate } from 'react-router-dom'
import PassportCard from '../components/PassportCard'
import { loadHistory } from '../hooks/useGameState'

const SIZES = [4, 6, 8, 9]

export default function PassportPage() {
  const navigate = useNavigate()
  const history = loadHistory()

  return (
    <div className="page page--passport">
      <header className="passport-header">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className="passport-header__title">My Passport</h1>
        <span className="passport-header__total">
          {history.length} puzzle{history.length !== 1 ? 's' : ''} solved
        </span>
      </header>

      <div className="passport-grid">
        {SIZES.map(size => (
          <PassportCard
            key={size}
            size={size}
            records={history.filter(r => r.size === size)}
          />
        ))}
      </div>
    </div>
  )
}
