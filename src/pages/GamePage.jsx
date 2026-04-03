import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../components/Board'
import NumPad from '../components/NumPad'
import WinModal from '../components/WinModal'
import { useGameState, loadActiveGame } from '../hooks/useGameState'

const SIZES = [4, 6, 8, 9]
const DIFFICULTIES = ['easy', 'medium', 'hard']
const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const SIZE_DESC = { 4: '2×2 boxes', 6: '2×3 boxes', 8: '2×4 boxes', 9: '3×3 boxes' }
const SIZE_EMOJI = { 4: '🌱', 6: '🌸', 8: '🌺', 9: '🌟' }

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function GamePage() {
  const navigate = useNavigate()
  const [setupSize, setSetupSize] = useState(9)
  const [setupDiff, setSetupDiff] = useState('easy')
  const [generating, setGenerating] = useState(false)

  const {
    puzzle,
    phase,
    elapsed,
    conflicts,
    hintCell,
    won,
    selectedCell,
    setSelectedCell,
    startNewPuzzle,
    continuePuzzle,
    pauseGame,
    setCellValue,
    useHint,
    resetToSetup,
  } = useGameState()

  // Check for a paused game in localStorage each render of setup screen
  const activeGame = phase === 'setup' ? loadActiveGame() : null

  function handleStart() {
    setGenerating(true)
    setTimeout(() => {
      startNewPuzzle(setupSize, setupDiff)
      setGenerating(false)
    }, 20)
  }

  function handleNumPad(value) {
    if (!selectedCell) return
    setCellValue(selectedCell.row, selectedCell.col, value)
  }

  // ── Setup screen ───────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="page page--setup">
        {/* Floating decorative shapes */}
        <span className="deco deco-1" aria-hidden="true" />
        <span className="deco deco-2" aria-hidden="true" />
        <span className="deco deco-3" aria-hidden="true" />
        <span className="deco deco-4" aria-hidden="true" />

        <div className="setup">
          <h1 className="setup__title">Sudokuco</h1>
          <p className="setup__subtitle">A cute little puzzle for you ✨</p>

          {/* Continue card — only shown when a paused game exists */}
          {activeGame && (
            <div className="continue-card">
              <div className="continue-card__info">
                <span className="continue-card__icon">🧩</span>
                <div>
                  <div className="continue-card__title">Paused game</div>
                  <div className="continue-card__meta">
                    {activeGame.puzzle.size}×{activeGame.puzzle.size}
                    {' · '}
                    <span className={`continue-card__diff continue-card__diff--${activeGame.puzzle.difficulty}`}>
                      {DIFF_LABEL[activeGame.puzzle.difficulty]}
                    </span>
                    {' · '}
                    {formatTime(activeGame.puzzle.elapsedSeconds ?? 0)}
                  </div>
                </div>
              </div>
              <button className="btn btn--primary" onClick={continuePuzzle}>
                Resume →
              </button>
            </div>
          )}

          <section className="setup__section">
            <h2 className="setup__label">Grid Size</h2>
            <div className="setup__size-pills">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-pill${setupSize === s ? ' size-pill--active' : ''}`}
                  onClick={() => setSetupSize(s)}
                >
                  <span className="size-pill__emoji">{SIZE_EMOJI[s]}</span>
                  <span className="size-pill__name">{s}×{s}</span>
                  <span className="size-pill__sub">{SIZE_DESC[s]}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="setup__section">
            <h2 className="setup__label">Difficulty</h2>
            <div className="setup__diff-tags">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`diff-tag diff-tag--${d}${setupDiff === d ? ' diff-tag--active' : ''}`}
                  onClick={() => setSetupDiff(d)}
                >
                  {DIFF_LABEL[d]}
                </button>
              ))}
            </div>
          </section>

          <button
            className="btn btn--primary btn--large"
            onClick={handleStart}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Generate Puzzle'}
          </button>

          <button className="passport-link" onClick={() => navigate('/passport')}>
            🛂 View Passport
          </button>
        </div>
      </div>
    )
  }

  // ── Game screen ────────────────────────────────────────────────────────
  return (
    <div className="page page--game">
      <header className="game-header">
        <button className="btn btn--ghost btn--sm" onClick={resetToSetup}>
          ← New Game
        </button>
        <div className="game-header__info">
          <span className="game-header__badge game-header__badge--size">
            {puzzle.size}×{puzzle.size}
          </span>
          <span className={`game-header__badge game-header__badge--diff game-header__badge--${puzzle.difficulty}`}>
            {DIFF_LABEL[puzzle.difficulty]}
          </span>
        </div>
        <div className="game-header__right">
          <div className="game-header__timer">{formatTime(elapsed)}</div>
          <button
            className="btn btn--pause"
            onClick={pauseGame}
            aria-label="Pause game"
            title="Pause"
          >
            ⏸
          </button>
        </div>
      </header>

      <div className="game-body">
        <Board
          puzzle={puzzle}
          conflicts={conflicts}
          hintCell={hintCell}
          selectedCell={selectedCell}
          onSelectCell={(r, c) => setSelectedCell({ row: r, col: c })}
          onChangeCell={setCellValue}
        />

        <div className="game-controls">
          <NumPad size={puzzle.size} onInput={handleNumPad} />
          <button className="btn btn--hint" onClick={useHint}>
            💡 Hint {puzzle.hintsUsed > 0 && <span className="hint-count">({puzzle.hintsUsed})</span>}
          </button>
        </div>
      </div>

      {won && (
        <WinModal
          puzzle={puzzle}
          elapsed={elapsed}
          onNewGame={resetToSetup}
        />
      )}
    </div>
  )
}
