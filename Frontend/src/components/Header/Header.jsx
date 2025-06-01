import React from 'react'
import './Header.css'
import { FaBuildingColumns } from 'react-icons/fa6'

const Header = () => {
  return (
    <div className='UnderStance-header'>
      <h1>
        <span><FaBuildingColumns /></span>
        <span className='UnderStance-Under'> Under</span>
        <span className='UnderStance-Stance'>Stance</span>
      </h1>
      <div className='UnderStance-underline' />
    </div>
  )
}

export default Header
