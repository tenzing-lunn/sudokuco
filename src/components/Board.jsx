import React from 'react'
import Cell from './Cell'

export default function Board({
  puzzle,
  conflicts,
  hintCell,
  selectedCell,
  onSelectCell,
  onChangeCell,
}) {
  const { board, given, size, boxRows, boxCols } = puzzle
  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col] : null

  return (
    <div
      className={`board board--${size}`}
      role="grid"
      aria-label="Sudoku board"
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isSelected = selectedCell?.row === r && selectedCell?.col === c
          const isHint = hintCell?.row === r && hintCell?.col === c
          const isSameValue = selectedValue && cell === selectedValue && !isSelected
          return (
            <Cell
              key={`${r}-${c}`}
              value={cell}
              isGiven={given[r][c]}
              isConflict={conflicts.has(`${r},${c}`)}
              isHint={isHint}
              isSelected={isSelected}
              isSameValue={isSameValue}
              row={r}
              col={c}
              size={size}
              boxRows={boxRows}
              boxCols={boxCols}
              onSelect={onSelectCell}
              onChange={onChangeCell}
            />
          )
        })
      )}
    </div>
  )
}
