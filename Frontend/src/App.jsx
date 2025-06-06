import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ReadStances from "./pages/ReadStances";
import Quiz from "./pages/Quiz";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
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
