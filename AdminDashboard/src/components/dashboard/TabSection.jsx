import "./TabSection.css";
import "./Dashboard.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import CardDisplay from "./CardDisplay";
import EditOverallModal from "./EditOverallModal";

const TabSection = ({ questions, categories, parties, stances }) => {
    const [selectedTab, setSelectedTab] = useState("quiz");
    const [showModal, setShowModal] = useState(false);

    const tabs = [
        { id: "quiz", label: "Quiz" },
        { id: "category", label: "Category" },
        { id: "party", label: "Party" },
        { id: "stance", label: "Stance" },
    ];

    // Load user's display cards set.
    const [cards, setCards] = useState({
        quiz: [
            {
                dataType: "questions",
                field: "IssueID",
                action: "count",
                filter: null,
                color: "blue",
                title: "Total Questions",
            },
            {
                dataType: "questions",
                field: "Active",
                action: "count",
                filter: null,
                color: "blue",
                title: "Active Questions",
            },
            {
                dataType: "questions",
                field: "IssueID",
                action: "count",
                filter: [
                    {
                        filterField: "Active",
                        filterValue: false,
                    },
                    {
                        filterField: "IssueID",
                        filterValue: 2,
                    },
                ],
                color: "red",
                title: "Filter Active False and IssueID 2",
            },
        ],
        category: [
            {
                dataType: "categories",
                field: "id",
                action: "count",
                filter: null,
                color: "green",
                title: "Total Categories",
            },
        ],
        party: [
            {
                dataType: "parties",
                field: "PartyID",
                action: "count",
                filter: null,
                color: "yellow",
                title: "Total Parties",
            },
            {
                dataType: "parties",
                field: "Active",
                action: "count",
                filter: null,
                color: "yellow",
                title: "Active Parties",
            },
        ],
        stance: [
            {
                dataType: "stances",
                field: "StanceId",
                action: "count",
                filter: null,
                color: "red",
                title: "Total Stances",
            },
            {
                dataType: "stances",
                field: "StanceID",
                action: "count",
                filter: [
                    {
                        filterField: "Party",
                        filterValue: "Coalition for Shakira",
                    },
                    {
                        filterField: "IssueID",
                        filterValue: 2,
                    },
                ],
                color: "red",
                title: "Filter Party CFS and IssueID 2",
            },
        ],
    });

    //Handles for updating individual tabs
    const handleSave = (newCard) => {
        setCards((prev) => ({
            ...prev,
            [selectedTab]: [...prev[selectedTab], newCard],
        }));
        setShowModal(false);
    };

    const handleUpdate = (index, updatedCard) => {
        setCards((prev) => ({
            ...prev,
            [selectedTab]: prev[selectedTab].map((c, i) => (i === index ? updatedCard : c)),
        }));
    };

    const handleDelete = (index) => {
        setCards((prev) => ({
            ...prev,
            [selectedTab]: prev[selectedTab].filter((_, i) => i !== index),
        }));
    };

    const handleReorder = (newCardList) => {
        setCards((prev) => ({
            ...prev,
            [selectedTab]: newCardList,
        }));
    };

    //Maybe consider implementing tab management.

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
                <div className="section-header-end">    
                    <button 
                        className="edit-button"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Display
                    </button>
                </div>
                <CardDisplay 
                    cards={cards[selectedTab]}
                    dataMap={{ questions, categories, parties, stances }}
                />
                <div className="footer-links">
                    <Link to={`/${selectedTab}`}>
                        <button type="button" className="redirect-button">
                            View {tabs.find(tab => tab.id === selectedTab)?.label} Management Page →
                        </button>
                    </Link>
                </div>
                {showModal && (
                    <EditOverallModal
                        onClose={() => setShowModal(false)}
                        onSave={handleSave}
                        data={{ questions, categories, parties, stances }}
                        cards={cards[selectedTab]}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                    />
                )}
            </div>
        </div>
        
    )
}

export default TabSection;