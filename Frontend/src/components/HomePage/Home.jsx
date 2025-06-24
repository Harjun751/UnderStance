// import React from "react";
// import { Link } from "react-router-dom";
import "./Home.css";
import DiscoverSection from "./DiscoverSection";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import Footer from "../Footer/Footer";

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

                {/* Footer Section */}
                <Footer />
            </div>
        </div>
    );
};

export default Home;
