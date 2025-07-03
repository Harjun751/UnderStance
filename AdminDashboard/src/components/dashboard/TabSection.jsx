import { MdQuiz } from "react-icons/md";
import "./TabSection.css";
import "./Dashboard.css"
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaFlag } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiInjustice } from "react-icons/gi";

const TabSection = () => {
    const [selectedTab, setSelectedTab] = useState("quiz");

    const tabs = [
        { id: "quiz", label: "Quiz" },
        { id: "category", label: "Category" },
        { id: "partie", label: "Party" },
        { id: "stance", label: "Stance" },
    ];

    return (
        <div className="tab-container">
            <div className="tab-headers">
                <ul className="tab-header">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className={selectedTab === tab.id ? "active" : ""}
                            onClick={() => setSelectedTab(tab.id)}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tab-content">
                {/* Quiz Example*/}
                {selectedTab === "quiz" && (
                    <div className="stats-grid">
                        <div className="card">
                            <div className="card-content">
                                <div className="text-block">
                                    <p className="card-title">Total Questions</p>
                                    <h3 className="card-number">11</h3>
                                </div>
                                <div className="icon-container blue">
                                    <MdQuiz />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                                <div className="text-block">
                                    <p className="card-title">Active Questions</p>
                                    <h3 className="card-number">2</h3>
                                </div>
                                <div className="icon-container blue">
                                    <MdQuiz />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Section */}
                {selectedTab === "category" && (
                    <div className="stats-grid">
                        <div className="card">
                            <div className="card-content">
                                <div className="text-block">
                                    <p className="card-title">Total Categories</p>
                                    <h3 className="card-number">5</h3>
                                </div>
                                <div className="icon-container green">
                                    <BiSolidCategoryAlt />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Party Section */}
                {selectedTab === "partie" && (
                    <div className="stats-grid">
                        <div className="card">
                            <div className="card-content">
                                <div className="text-block">
                                    <p className="card-title">Total Parties</p>
                                    <h3 className="card-number">4</h3>
                                </div>
                                <div className="icon-container yellow">
                                    <FaFlag />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stance Section */}
                {selectedTab === "stance" && (
                    <div className="stats-grid">
                        <div className="card">
                            <div className="card-content">
                                <div className="text-block">
                                    <p className="card-title">Total Stances</p>
                                    <h3 className="card-number">44</h3>
                                </div>
                                <div className="icon-container red">
                                    <GiInjustice />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="footer-links">
                    <Link to={`/${selectedTab}`}>
                        <button type="button" className="redirect-button">
                            View {tabs.find(tab => tab.id === selectedTab)?.label} Management Page →
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        
    )
}

export default TabSection;