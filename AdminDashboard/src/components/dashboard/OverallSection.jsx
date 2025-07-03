import "./OverallSection.css";
import "./Dashboard.css";
import { MdQuiz, MdSpaceDashboard } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { GiInjustice } from "react-icons/gi";
import { BiSolidCategoryAlt } from "react-icons/bi";

const OverallSection = ({ questions, categories, parties }) => {
    return (
        <div className="section-container">
            <div className="section-header">
                <h3>Overall Breakdown</h3>
                <div className="section-header-end">    
                    <button className="edit-button">
                        Edit Display
                    </button>
                </div>
            </div>
            <div className="stats-grid">
                <div className="card">
                    <div className="card-content">
                        <div className="text-block">
                            <p className="card-title">Total Questions</p>
                            <h3 className="card-number">{questions.length}</h3>
                        </div>
                        <div className="icon-container blue">
                            <MdQuiz/>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <div className="text-block">
                            <p className="card-title">Total Categories</p>
                            <h3 className="card-number">{categories.length}</h3>
                        </div>
                        <div className="icon-container green">
                            <BiSolidCategoryAlt />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <div className="text-block">
                            <p className="card-title">Total Parties</p>
                            <h3 className="card-number">{parties.length}</h3>
                        </div>
                        <div className="icon-container yellow">
                            <FaFlag />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <div className="text-block">
                            <p className="card-title">Leave Blank for now</p>
                            <h3 className="card-number">—</h3>
                        </div>
                        <div className="icon-container red">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverallSection;