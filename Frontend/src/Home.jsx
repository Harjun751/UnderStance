import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import { FaBuildingColumns } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <h1> <FaBuildingColumns /> UnderStance</h1>
        <p>Understand your political stance today!</p>
        <Link to='/quiz'>
          <button className="cta-button">Try it Now!</button>
        </Link>
        <footer>Footer</footer>
      </div>
    </div>
  );
}

export default Home;
