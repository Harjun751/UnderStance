import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import ReadStances from './pages/ReadStances'
import Quiz from './pages/Quiz'
import Navbar from './components/Navbar/Navbar'
import './App.css'

function App () {
  return (
   <Router>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet"/>
      <div className='app-container'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/read-stances' element={<ReadStances />} />
          <Route path='/quiz' element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
