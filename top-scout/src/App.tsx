import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './Components/Pages/Login'
import Home from './Components/Pages/Home'
import Results from './Components/Pages/Results'
import Analysis from './Components/Pages/Analysis'
import TopBar from './Components/Layout/Layout'

export type ThemeMode = 'light' | 'dark'

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <BrowserRouter>
      <TopBar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<LoginForm theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/login" element={<LoginForm theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/Login" element={<LoginForm theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:jobId" element={<Results />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
