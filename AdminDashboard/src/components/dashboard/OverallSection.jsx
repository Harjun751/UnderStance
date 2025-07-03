import "./OverallSection.css";
import "./Dashboard.css";
import { MdQuiz, MdSpaceDashboard } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { GiInjustice } from "react-icons/gi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useState } from "react";
import EditOverallModal from "./EditOverallModal";

const iconMap = {
  questions: <MdQuiz />,
  categories: <BiSolidCategoryAlt />,
  parties: <FaFlag />,
};

const OverallSection = ({ questions, categories, parties }) => {
    const [showModal, setShowModal] = useState(false);
    const [cards, setCards] = useState([
        {
            dataType: "questions",
            field: "IssueId",
            action: "count",
            color: "blue",
            title: "Total Questions",
        },
        {
            dataType: "categories",
            field: "id",
            action: "count",
            color: "green",
            title: "Total Categories",
        },
        {
            dataType: "parties",
            field: "id",
            action: "count",
            color: "yellow",
            title: "Total Parties",
        },
    ]);

    const dataMap = { questions, categories, parties };

    const handleSave = (newCard) => {
        setCards((prev) => [...prev, newCard]);
        setShowModal(false);
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h3>Overall Breakdown</h3>
                <div className="section-header-end">    
                    <button 
                        className="edit-button"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Display
                    </button>
                </div>
            </div>
            <div className="stats-grid">
                {cards.map((card, idx) => {
                    const data = dataMap[card.dataType] || [];
                    let cardValue = 0;

                    if (card.action === "count") {
                        cardValue = data.length;
                    } else if (card.action === "countUnique") {
                        const uniqueValues = new Set(data.map((item) => item[card.field]));
                        cardValue = uniqueValues.size;
                    }

                    return (
                        <div className="card" key={idx}>
                            <div className="card-content">
                                <div className="text-block">
                                    <p className="card-title">{card.title}</p>
                                    <h3 className="card-number">{cardValue}</h3>
                                </div>
                                <div className={`icon-container ${card.color}`}>
                                    {iconMap[card.dataType]}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {showModal && (
                <EditOverallModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    data={{ questions, categories, parties }}
                />
            )}
        </div>
    )
}

export default OverallSection;