import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/* Page imports */
import LoginPage from './components/auth/LoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<>Hi</>} />
            <Route path="login" element={<LoginPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
