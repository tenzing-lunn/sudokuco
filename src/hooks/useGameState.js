import { useState, useEffect, useCallback, useRef } from 'react'
import { generatePuzzle } from '../logic/generator'
import { getConflicts, isBoardComplete } from '../logic/validator'
import { getHint } from '../logic/hints'

const BOX_DIMS = {
  4: { boxRows: 2, boxCols: 2 },
  6: { boxRows: 2, boxCols: 3 },
  8: { boxRows: 2, boxCols: 4 },
  9: { boxRows: 3, boxCols: 3 },
}

const KEY_PUZZLE      = 'sudokuco_puzzle'
const KEY_ACTIVE_GAME = 'sudokuco_active_game'
const KEY_HISTORY     = 'sudokuco_history'

// ── Storage helpers ────────────────────────────────────────────────────

function loadPuzzle() {
  try { return JSON.parse(localStorage.getItem(KEY_PUZZLE)) ?? null } catch { return null }
}
function savePuzzle(p) {
  try { localStorage.setItem(KEY_PUZZLE, JSON.stringify(p)) } catch {}
}
function clearPuzzle() { localStorage.removeItem(KEY_PUZZLE) }

export function loadActiveGame() {
  try { return JSON.parse(localStorage.getItem(KEY_ACTIVE_GAME)) ?? null } catch { return null }
}
function saveActiveGame(data) {
  try { localStorage.setItem(KEY_ACTIVE_GAME, JSON.stringify(data)) } catch {}
}
function clearActiveGame() { localStorage.removeItem(KEY_ACTIVE_GAME) }

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORY)) ?? [] } catch { return [] }
}
function saveHistory(h) {
  try { localStorage.setItem(KEY_HISTORY, JSON.stringify(h)) } catch {}
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useGameState() {
  const [puzzle, setPuzzleRaw] = useState(() => loadPuzzle())
  const [phase, setPhase] = useState(() => loadPuzzle() ? 'playing' : 'setup')
  const [elapsed, setElapsed] = useState(0)
  const [conflicts, setConflicts] = useState(new Set())
  const [hintCell, setHintCell] = useState(null)
  const [won, setWon] = useState(false)
  const [selectedCell, setSelectedCell] = useState(null)

  // sessionStart tracks when the *current* play session began (not persisted)
  const sessionStartRef = useRef(Date.now())
  const timerRef = useRef(null)

  // Helper: set puzzle and persist
  const setPuzzle = useCallback((p) => {
    setPuzzleRaw(p)
    if (p) savePuzzle(p)
    else clearPuzzle()
  }, [])

  // Recompute conflicts whenever board changes
  useEffect(() => {
    if (!puzzle) return
    setConflicts(getConflicts(puzzle.board, puzzle.size, puzzle.boxRows, puzzle.boxCols))
  }, [puzzle])

  // Timer — uses elapsedSeconds offset + sessionStart, never raw timestamps across sessions
  useEffect(() => {
    clearInterval(timerRef.current)
    if (phase !== 'playing' || won) return

    timerRef.current = setInterval(() => {
      const offset = puzzle?.elapsedSeconds ?? 0
      setElapsed(offset + Math.floor((Date.now() - sessionStartRef.current) / 1000))
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [phase, won, puzzle?.elapsedSeconds])

  // ── Actions ───────────────────────────────────────────────────────────

  const startNewPuzzle = useCallback((size, difficulty) => {
    clearActiveGame()
    const { boxRows, boxCols } = BOX_DIMS[size]
    const generated = generatePuzzle(size, boxRows, boxCols, difficulty)
    const p = { ...generated, elapsedSeconds: 0, hintsUsed: 0 }
    setPuzzle(p)
    sessionStartRef.current = Date.now()
    setPhase('playing')
    setElapsed(0)
    setWon(false)
    setSelectedCell(null)
    setHintCell(null)
  }, [setPuzzle])

  const continuePuzzle = useCallback(() => {
    const saved = loadActiveGame()
    if (!saved) return
    const p = saved.puzzle
    setPuzzle(p)
    sessionStartRef.current = Date.now()
    setPhase('playing')
    setElapsed(p.elapsedSeconds ?? 0)
    setWon(false)
    setSelectedCell(null)
    setHintCell(null)
    clearActiveGame()
    // Put it back as the active puzzle key too
    savePuzzle(p)
  }, [setPuzzle])

  const pauseGame = useCallback(() => {
    if (!puzzle || phase !== 'playing') return
    clearInterval(timerRef.current)
    const currentElapsed = (puzzle.elapsedSeconds ?? 0) + Math.floor((Date.now() - sessionStartRef.current) / 1000)
    const snapshotPuzzle = { ...puzzle, elapsedSeconds: currentElapsed }
    saveActiveGame({ puzzle: snapshotPuzzle })
    clearPuzzle()
    setPuzzleRaw(null)
    setPhase('setup')
    setElapsed(0)
    setSelectedCell(null)
  }, [puzzle, phase])

  const setCellValue = useCallback((row, col, value) => {
    if (!puzzle || puzzle.given[row][col] || won) return

    const newBoard = puzzle.board.map(r => [...r])
    newBoard[row][col] = value
    const updated = { ...puzzle, board: newBoard }
    setPuzzle(updated)

    if (isBoardComplete(newBoard, puzzle.solution, puzzle.size)) {
      const timeSeconds = (puzzle.elapsedSeconds ?? 0) + Math.floor((Date.now() - sessionStartRef.current) / 1000)
      clearInterval(timerRef.current)
      setWon(true)
      setElapsed(timeSeconds)
      const record = {
        size: puzzle.size,
        difficulty: puzzle.difficulty,
        timeSeconds,
        hintsUsed: puzzle.hintsUsed,
        date: new Date().toISOString(),
        completed: true,
      }
      const history = loadHistory()
      history.push(record)
      saveHistory(history)
      clearPuzzle()
      clearActiveGame()
    }
  }, [puzzle, won, setPuzzle])

  const useHint = useCallback(() => {
    if (!puzzle || won) return
    const hint = getHint(puzzle.board, puzzle.solution, puzzle.given, puzzle.size)
    if (!hint) return

    const newBoard = puzzle.board.map(r => [...r])
    newBoard[hint.row][hint.col] = hint.value
    const updated = { ...puzzle, board: newBoard, hintsUsed: puzzle.hintsUsed + 1 }
    setPuzzle(updated)
    setHintCell({ row: hint.row, col: hint.col })
    setTimeout(() => setHintCell(null), 1200)

    if (isBoardComplete(newBoard, puzzle.solution, puzzle.size)) {
      const timeSeconds = (puzzle.elapsedSeconds ?? 0) + Math.floor((Date.now() - sessionStartRef.current) / 1000)
      clearInterval(timerRef.current)
      setWon(true)
      setElapsed(timeSeconds)
      const record = {
        size: puzzle.size,
        difficulty: puzzle.difficulty,
        timeSeconds,
        hintsUsed: updated.hintsUsed,
        date: new Date().toISOString(),
        completed: true,
      }
      const history = loadHistory()
      history.push(record)
      saveHistory(history)
      clearPuzzle()
      clearActiveGame()
    }
  }, [puzzle, won, setPuzzle])

  const resetToSetup = useCallback(() => {
    clearInterval(timerRef.current)
    clearPuzzle()
    clearActiveGame()
    setPuzzleRaw(null)
    setPhase('setup')
    setWon(false)
    setSelectedCell(null)
    setHintCell(null)
    setElapsed(0)
  }, [])

  return {
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
  }
}
