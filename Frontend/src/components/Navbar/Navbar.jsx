import React, { useState } from 'react'
import './Navbar.css'
import { FaBuildingColumns } from 'react-icons/fa6'
import { PiBookOpenTextFill } from 'react-icons/pi'
import { MdFactCheck } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded)
  }

  return (<div></div>);

  return (
    <div className={`navbar ${isExpanded ? 'expanded' : ''}`}>
      <button className='toggle-btn' onClick={toggleNavbar}>
        {isExpanded ? '◄' : '►'}
      </button>
      {/* Navbar content will go here */}
      <nav className='nav-links'>
        <ul className='main menu'>
          <Link to='/' className='nav-item'>
            <span className='nav-icon'><FaBuildingColumns /></span>
            {isExpanded && <span className='nav-text'>Home</span>}
          </Link>

          <Link to='/quiz' className='nav-item'>
            <span className='nav-icon'><MdFactCheck /></span>
            {isExpanded && <span className='nav-text'>Try it!</span>}
          </Link>

          <Link to='/read-stances' className='nav-item'>
            <span className='nav-icon'><PiBookOpenTextFill /></span>
            {isExpanded && <span className='nav-text'>Read Stances</span>}
          </Link>

        </ul>
      </nav>
    </div>
  )
}

export default Navbar
