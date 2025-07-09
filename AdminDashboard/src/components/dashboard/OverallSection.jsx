import "./OverallSection.css";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import EditOverallModal from "./EditOverallModal";
import CardDisplay from "./CardDisplay";


const OverallSection = ({ questions, categories, parties, stances, dashData, updateDashDataHandler }) => {
    const [showModal, setShowModal] = useState(false);

    //Default set of Cards, meant for user's without any data in their card deck.
    const defaultCards = [
        {
            dataType: "questions",
            field: "IssueID",
            action: "count",
            filter: [],
            color: "blue",
            title: "Total Questions",
        },
        {
            dataType: "categories",
            field: "CategoryID",
            action: "count",
            filter: [],
            color: "green",
            title: "Total Categories",
        },
        {
            dataType: "parties",
            field: "PartyID",
            action: "count",
            filter: [],
            color: "yellow",
            title: "Total Parties",
        },
        {
            dataType: "stances",
            field: "StanceID",
            action: "count",
            filter: [],
            color: "red",
            title: "Total Stances",
        },
    ]

    //Load user's default cards by default.
    const [cards, setCards] = useState(defaultCards);

    //Update cards if dashData.overall is not empty
    useEffect(() => {
        if (dashData?.overall?.length > 0) {
            setCards(dashData.overall);
        }
    }, [dashData?.overall]);

    const dataMap = { questions, categories, parties, stances };

    const handleSave = (newCard) => {
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        saveDashData(updatedCards);
        setShowModal(false);
    };

    const handleUpdate = (index, updatedCard) => {
        const updatedCards = cards.map((c, i) => (i === index ? updatedCard : c));
        setCards(updatedCards);
        saveDashData(updatedCards);
    };

    const handleDelete = (index) => {
        const updatedCards = cards.filter((_, i) => i !== index);
        setCards(updatedCards);
        saveDashData(updatedCards);
    };

    const handleReorder = (newCardList) => {
        setCards(newCardList);
        saveDashData(newCardList);
    };

    const saveDashData = (newCards) => {
        updateDashDataHandler(newCards, dashData?.tabs ?? []);
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h3>Overall Breakdown</h3>
                <div className="section-header-end">    
                    <button 
                        type="button"
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
                    onReorder={handleReorder}
                />
            )}
        </div>
    )
}

export default OverallSection;