import React, { useState } from 'react'
import './Navbar.css'
import Hamburger from './Hamburger'
import { FaBuildingColumns } from 'react-icons/fa6'
import { PiBookOpenTextFill } from 'react-icons/pi'
import { MdFactCheck } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  function toggleNavbar() {
    setIsExpanded(!isExpanded)
  }

  return (
      <div >
        <Hamburger onClick={toggleNavbar} className={'burger'} />
        <nav className={`navbar ${isExpanded ? 'expanded' : ''}`}>
            <span class="divider"></span>
          <NavLink activeClassName='active' to='/' className='nav-item'>
            <span className='nav-icon'><FaBuildingColumns /></span>
            <span className='nav-text'>Home</span>
          </NavLink>
            <span class="divider"></span>
          <NavLink activeClassName='active' to='/quiz' className='nav-item'>
            <span className='nav-icon'><MdFactCheck /></span>
            <span className='nav-text'>Try it!</span>
          </NavLink>
            <span class="divider"></span>
          <NavLink activeClassName='active' to='/read-stances' className='nav-item'>
            <span className='nav-icon'><PiBookOpenTextFill /></span>
            <span className='nav-text'>Read Stances</span>
          </NavLink>
            <span class="divider"></span>
      </nav>

    </div>
  )
}

export default Navbar
