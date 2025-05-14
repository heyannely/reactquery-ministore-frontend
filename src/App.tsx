// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home      from './components/Home'
import LoginForm from './components/login'
import Current   from './components/Current'

export default function App() {
  return (
    <Routes>
      {/* product list */}
      <Route path="/" element={<Home />} />

      {/* login form */}
      <Route path="/login" element={<LoginForm />} />

      {/* new “current profile” dump */}
      <Route path="/current" element={<Current />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}