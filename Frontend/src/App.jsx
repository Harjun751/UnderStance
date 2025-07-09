//import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/HomePage/Home";
import ReadStances from "./components/ReadStancesPage/ReadStances";
import Quiz from "./components/QuizPage/Quiz";
import Header from "./components/Header/Header";
import "./App.css";
import ReactGA from "react-ga4";
import { useEffect } from "react";

ReactGA.initialize("G-4ZEGR53H48");

function AnalyticsWrapper() {
    const location = useLocation();

    //Send a pageview on route change
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }, [location]);
    
    return (
        <div className="app-container">
            <Navbar />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/read-stances" element={<ReadStances />} />
                <Route path="/quiz" element={<Quiz />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AnalyticsWrapper />
        </Router>
    );
}

export default App;
