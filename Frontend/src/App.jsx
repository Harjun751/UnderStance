import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/Home";
import ReadStances from "./components/ReadStancesPage/ReadStances";
import Quiz from "./components/QuizPage/Quiz";
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
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
