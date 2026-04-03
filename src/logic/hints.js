// Find an empty cell that has exactly one valid value according to the solution
// Returns { row, col, value } or null
export function getHint(board, solution, given, size) {
  // Collect all empty cells
  const empty = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!given[r][c] && board[r][c] === null) {
        empty.push([r, c])
      }
    }
  }
  if (empty.length === 0) return null

  // Pick a random empty cell to hint (avoids always hinting top-left)
  const idx = Math.floor(Math.random() * empty.length)
  const [row, col] = empty[idx]
  return { row, col, value: solution[row][col] }
}
