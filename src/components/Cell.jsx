import React from 'react'

export default function Cell({
  value,
  isGiven,
  isConflict,
  isHint,
  isSelected,
  isSameValue,
  row,
  col,
  size,
  boxRows,
  boxCols,
  onSelect,
  onChange,
}) {
  const borderRight = (col + 1) % boxCols === 0 && col !== size - 1
  const borderBottom = (row + 1) % boxRows === 0 && row !== size - 1

  let cellClass = 'cell'
  if (isGiven) cellClass += ' cell--given'
  if (isConflict) cellClass += ' cell--conflict'
  if (isHint) cellClass += ' cell--hint'
  if (isSelected) cellClass += ' cell--selected'
  if (isSameValue && !isSelected) cellClass += ' cell--same-value'
  if (borderRight) cellClass += ' cell--border-right'
  if (borderBottom) cellClass += ' cell--border-bottom'

  function handleKeyDown(e) {
    if (isGiven) return
    const n = parseInt(e.key)
    if (!isNaN(n) && n >= 1 && n <= size) {
      onChange(row, col, n)
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      onChange(row, col, null)
    }
  }

  return (
    <div
      className={cellClass}
      tabIndex={isGiven ? -1 : 0}
      onClick={() => onSelect(row, col)}
      onKeyDown={handleKeyDown}
      role="gridcell"
      aria-label={`Row ${row + 1} Col ${col + 1}${value ? ` value ${value}` : ''}`}
    >
      {value || ''}
    </div>
  )
}
