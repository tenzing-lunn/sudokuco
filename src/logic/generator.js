// Pure logic — no React imports

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function emptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

function isValid(grid, row, col, num, size, boxRows, boxCols) {
  // Check row
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === num) return false
  }
  // Check col
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false
  }
  // Check box
  const startRow = Math.floor(row / boxRows) * boxRows
  const startCol = Math.floor(col / boxCols) * boxCols
  for (let r = startRow; r < startRow + boxRows; r++) {
    for (let c = startCol; c < startCol + boxCols; c++) {
      if (grid[r][c] === num) return false
    }
  }
  return true
}

function fillGrid(grid, size, boxRows, boxCols) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        const candidates = shuffle(Array.from({ length: size }, (_, i) => i + 1))
        for (const num of candidates) {
          if (isValid(grid, row, col, num, size, boxRows, boxCols)) {
            grid[row][col] = num
            if (fillGrid(grid, size, boxRows, boxCols)) return true
            grid[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

// Count solutions — stops at 2 for uniqueness check
function countSolutions(grid, size, boxRows, boxCols, limit = 2) {
  let count = 0
  function solve(g) {
    if (count >= limit) return
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (g[row][col] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValid(g, row, col, num, size, boxRows, boxCols)) {
              g[row][col] = num
              solve(g)
              g[row][col] = 0
              if (count >= limit) return
            }
          }
          return
        }
      }
    }
    count++
  }
  const copy = grid.map(r => [...r])
  solve(copy)
  return count
}

const DIFFICULTY_REVEAL = { easy: 0.62, medium: 0.46, hard: 0.31 }

export function generatePuzzle(size, boxRows, boxCols, difficulty) {
  // Build solution
  const solution = emptyGrid(size)
  fillGrid(solution, size, boxRows, boxCols)

  // Determine cells to reveal
  const total = size * size
  const revealCount = Math.round(total * DIFFICULTY_REVEAL[difficulty])

  // Build list of all positions, shuffle, punch holes
  const positions = shuffle(
    Array.from({ length: total }, (_, i) => [Math.floor(i / size), i % size])
  )

  // Start with full solution, punch holes one by one
  const puzzle = solution.map(r => [...r])
  let holes = 0
  const target = total - revealCount

  for (const [row, col] of positions) {
    if (holes >= target) break
    const backup = puzzle[row][col]
    puzzle[row][col] = 0

    // Uniqueness check — skip for easy to keep generation fast
    if (difficulty !== 'easy') {
      if (countSolutions(puzzle, size, boxRows, boxCols) !== 1) {
        puzzle[row][col] = backup
        continue
      }
    }
    holes++
  }

  const given = puzzle.map(row => row.map(cell => cell !== 0))
  const board = puzzle.map(row => row.map(cell => cell === 0 ? null : cell))

  return { solution, board, given, size, boxRows, boxCols, difficulty }
}
