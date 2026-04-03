// Returns a Set of "row,col" strings for cells in conflict
export function getConflicts(board, size, boxRows, boxCols) {
  const conflicts = new Set()

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const val = board[row][col]
      if (!val) continue

      // Check row
      for (let c = 0; c < size; c++) {
        if (c !== col && board[row][c] === val) {
          conflicts.add(`${row},${col}`)
          conflicts.add(`${row},${c}`)
        }
      }

      // Check col
      for (let r = 0; r < size; r++) {
        if (r !== row && board[r][col] === val) {
          conflicts.add(`${row},${col}`)
          conflicts.add(`${r},${col}`)
        }
      }

      // Check box
      const startRow = Math.floor(row / boxRows) * boxRows
      const startCol = Math.floor(col / boxCols) * boxCols
      for (let r = startRow; r < startRow + boxRows; r++) {
        for (let c = startCol; c < startCol + boxCols; c++) {
          if ((r !== row || c !== col) && board[r][c] === val) {
            conflicts.add(`${row},${col}`)
            conflicts.add(`${r},${c}`)
          }
        }
      }
    }
  }

  return conflicts
}

export function isBoardComplete(board, solution, size) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== solution[r][c]) return false
    }
  }
  return true
}
