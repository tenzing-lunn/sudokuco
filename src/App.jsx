import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GamePage from './pages/GamePage'
import PassportPage from './pages/PassportPage'
import './styles.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/passport" element={<PassportPage />} />
      </Routes>
    </BrowserRouter>
  )
}
