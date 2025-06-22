import './DiscoverSection.css';
import { Link } from 'react-router-dom';
import { TbCircleCheckFilled } from "react-icons/tb";
import { CgRadioCheck } from "react-icons/cg";
import { RiBarChartHorizontalFill } from "react-icons/ri";
import { useState } from 'react';


const DiscoverSection = () => {

    const [hoveredItem, setHoveredItem] = useState("quiz");


    return (
        <div className="discover-section">
            <div className="discover-container">
                <div className="discover-header">
                    <h2 className="discover-subtitle">Discover</h2>
                    <div className="discover-items">
                        {/* Quiz Item */}
                        <button 
                            className={`item ${hoveredItem && hoveredItem !== "quiz" ? "faded" : ""}`}
                            onMouseEnter={() => setHoveredItem("quiz")}
                            type="button"
                            onFocus={() => setHoveredItem("quiz")}
                        >
                            <p className="discover-title">Take Our Quiz</p>
                            <p className="discover-description">
                                Answer a series of questions to uncover your political party leanings.
                            </p>
                        </button>

                        {/* Read Stances Item */}
                        <button 
                            className={`item ${hoveredItem && hoveredItem !== "read" ? "faded" : ""}`}
                            onMouseEnter={() => setHoveredItem('read')}
                            type="button"
                            onFocus={() => setHoveredItem("read")}
                        >
                            <p className="discover-title">Read Party Stances</p>
                            <p className="discover-description">
                                No time to complete the quiz? You can still read each party’s reply here!
                            </p>
                        </button>
                    </div>
                    
                </div>

                {/* Quiz Discover Card */}
                {hoveredItem === "quiz" && (
                    <div 
                        className="discover-card-wrapper"
                    >
                        <div className="discover-card">
                            <div className="discover-card-content">
                                <div className="discover-intro">
                                    <div className="discover-icon">
                                        <i className="icon-white icon-lg"><RiBarChartHorizontalFill /></i>
                                    </div>
                                    <div className="discover-intro-text">
                                        <h3 className="discover-heading">UnderStance Quiz</h3>
                                        <p className="discover-detail">10 questions • Takes about 5 minutes • Completely anonymous</p>
                                    </div>
                                </div>

                                <div className="discover-grid">
                                <div className="discover-box red-box">
                                    <h4 className="discover-box-title red-text">What you'll discover:</h4>
                                    <ul className="discover-list">
                                    <li>
                                        <i className="icon-red"><TbCircleCheckFilled /></i>
                                        <span>Your political stance in relation to other parties</span>
                                    </li>
                                    <li>
                                        <i className="icon-red"><TbCircleCheckFilled /></i>
                                        <span>Comparison between all Parties</span>
                                    </li>
                                    <li>
                                        <i className="icon-red"><TbCircleCheckFilled /></i>
                                        <span>How each party relates to your answer</span>
                                    </li>
                                    </ul>
                                </div>

                                <div className="discover-box gray-box">
                                    <h4 className="discover-box-title gray-text">How it works:</h4>
                                    <ul className="discover-list">
                                    <li>
                                        <i className="icon-gray"><CgRadioCheck /></i>
                                        <span>Answer questions honestly</span>
                                    </li>
                                    <li>
                                        <i className="icon-gray"><CgRadioCheck /></i>
                                        <span>No right or wrong answers</span>
                                    </li>
                                    <li>
                                        <i className="icon-gray"><CgRadioCheck /></i>
                                        <span>Get instant results</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>

                                <div className="discover-action">
                                    <Link to="/quiz">
                                        <button type="button" className="btn btn-large btn-primary">
                                            Start Quiz Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                

                {/* Read Stances Discover Card */}
                {hoveredItem === "read" && (
                    <div 
                        className="discover-card-wrapper"
                    >
                        <div className="discover-card">
                            <div className="discover-card-content">
                                <div className="discover-intro">
                                    <div className="discover-icon">
                                        <i className="icon-white icon-lg"><RiBarChartHorizontalFill /></i>
                                    </div>
                                    <div className="discover-intro-text">
                                        <h3 className="discover-heading">Read Stances</h3>
                                        <p className="discover-detail">10 questions</p>
                                    </div>
                                </div>

                                <div className="discover-grid">
                                <div className="discover-box red-box">
                                    <h4 className="discover-box-title red-text">What you'll discover:</h4>
                                    <ul className="discover-list">
                                        <li>
                                            <i className="icon-red"><TbCircleCheckFilled /></i>
                                            <span>Party’s answer to each question</span>
                                        </li>
                                        <li>
                                            <i className="icon-red"><TbCircleCheckFilled /></i>
                                            <span>Party’s detailed reply to each question</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="discover-box gray-box">
                                    <h4 className="discover-box-title gray-text">How it works:</h4>
                                    <ul className="discover-list">
                                        <li>
                                            <i className="icon-gray"><CgRadioCheck /></i>
                                            <span>Click on the question to view party's answer & reply</span>
                                        </li>
                                        <li>
                                            <i className="icon-gray"><CgRadioCheck /></i>
                                            <span>Scroll if needed to view all detailed replies</span>
                                        </li>

                                    </ul>
                                </div>
                                </div>

                                <div className="discover-action">
                                    <Link to="/read-stances">
                                        <button type="button" className="btn btn-large btn-primary">
                                            Read Stances Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DiscoverSection;