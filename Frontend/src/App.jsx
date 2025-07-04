//import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/HomePage/Home";
import ReadStances from "./components/ReadStancesPage/ReadStances";
import Quiz from "./components/QuizPage/Quiz";
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import "./App.css";
import ReactGA from "react-ga4";
import { useEffect } from "react";

function App() {
    const location = useLocation();

    //Send a pageview on route change
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }, [location]);
    
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/read-stances" element={<ReadStances />} />
                    <Route path="/quiz" element={<Quiz />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
