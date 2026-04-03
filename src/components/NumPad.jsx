import React from 'react'

export default function NumPad({ size, onInput }) {
  const nums = Array.from({ length: size }, (_, i) => i + 1)
  return (
    <div className="numpad">
      {nums.map(n => (
        <button key={n} className="numpad__btn" onClick={() => onInput(n)}>
          {n}
        </button>
      ))}
      <button className="numpad__btn numpad__btn--erase" onClick={() => onInput(null)}>
        ⌫
      </button>
    </div>
  )
}
