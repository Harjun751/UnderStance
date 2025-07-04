import "./OverallSection.css";
import "./Dashboard.css";
import { useState } from "react";
import EditOverallModal from "./EditOverallModal";
import CardDisplay from "./CardDisplay";


const OverallSection = ({ questions, categories, parties, stances }) => {
    const [showModal, setShowModal] = useState(false);

    // Load user's display cards set.
    const [cards, setCards] = useState([
        {
            dataType: "questions",
            field: "IssueId",
            action: "count",
            filter: null,
            color: "blue",
            title: "Total Questions",
        },
        {
            dataType: "categories",
            field: "id",
            action: "count",
            filter: null,
            color: "green",
            title: "Total Categories",
        },
        {
            dataType: "parties",
            field: "id",
            action: "count",
            filter: null,
            color: "yellow",
            title: "Total Parties",
        },
        {
            dataType: "stances",
            field: "id",
            action: "count",
            filter: null,
            color: "red",
            title: "Total Stances",
        },
    ]);

    const dataMap = { questions, categories, parties, stances };
    console.log("DataMap:", dataMap);
    // Handles adding new card into the display cards set.
    const handleSave = (newCard) => {
        setCards((prev) => [...prev, newCard]);
        setShowModal(false);
    };

    const handleUpdate = (index, updatedCard) => {
        setCards(prev => prev.map((c, i) => (i === index ? updatedCard : c)));
    };

    const handleDelete = (index) => {
        setCards(prev => prev.filter((_, i) => i !== index));
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
            <CardDisplay 
                cards={cards}
                dataMap={dataMap}
            />
            {showModal && (
                <EditOverallModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    data={{ questions, categories, parties, stances }}
                    cards={cards}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

export default OverallSection;