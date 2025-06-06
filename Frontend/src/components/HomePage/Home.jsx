import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='App'>
      <div className='content'>
        <div id='content-container'>
          <p>Understand your political stance today!</p>
          <Link to='/quiz'>
            <button className='cta-button'>Try it Now!</button>
          </Link>
        </div>
        <footer>Footer</footer>
      </div>
    </div>
  )
}

export default Home
