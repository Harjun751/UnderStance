import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import DiscoverSection from "./DiscoverSection";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";

const Home = () => {
    return (
        <div className="App">
            <div className="home-container">
                {/* Hero Section Eye Grabbing */}
                <HeroSection />

                {/* Feature Section */}
                <FeatureSection />

                {/* Discover Section */}
                <DiscoverSection />
            </div>
            

            {/* <div className="content">
                <div id="content-container">
                    
                    <p>Understand your political stance today!</p>
                    <Link to="/discover">
                        <button type="button" className="cta-button">
                            Try it Now!
                        </button>
                    </Link>
                </div>
                <footer>Footer</footer>
            </div> */}
            
        </div>
        
    );
};

export default Home;
