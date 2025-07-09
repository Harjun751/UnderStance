import "./TabSection.css";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardDisplay from "./CardDisplay";
import EditOverallModal from "./EditOverallModal";

const TabSection = ({ questions, categories, parties, stances, dashData, updateDashDataHandler }) => {
    const [selectedTab, setSelectedTab] = useState("quiz");
    const [showModal, setShowModal] = useState(false);

    const tabs = [
        { id: "quiz", label: "Quiz" },
        { id: "category", label: "Category" },
        { id: "party", label: "Party" },
        { id: "stance", label: "Stance" },
    ];

    //Default set of Cards, again meant for users without any data in their tabs card deck.
    const defaultCards = {
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
    }

    //Load default cards by default.
    const [cards, setCards] = useState(defaultCards);

    //If ALL tabs are not empty, then load tabs card data instead.

    useEffect(() => {
        const quiz = dashData?.tabs?.quiz ?? [];
        const category = dashData?.tabs?.category ?? [];
        const party = dashData?.tabs?.party ?? [];
        const stance = dashData?.tabs?.stance ?? [];
        if (
            quiz.length > 0 &&
            category.length > 0 &&
            party.length > 0 &&
            stance.length > 0
        ) {
            setCards(dashData.tabs);
        }
    }, [dashData?.tabs]);

    const handleSave = (newCard) => {
        const updated = {
            ...cards,
            [selectedTab]: [...cards[selectedTab], newCard],
        };
        setCards(updated);
        saveDashData(updated);
        setShowModal(false);
    };

    const handleUpdate = (index, updatedCard) => {
        const updated = {
            ...cards,
            [selectedTab]: cards[selectedTab].map((c, i) =>
                i === index ? updatedCard : c
            ),
        };
        setCards(updated);
        saveDashData(updated);
    };

    const handleDelete = (index) => {
        const updated = {
            ...cards,
            [selectedTab]: cards[selectedTab].filter((_, i) => i !== index),
        };
        setCards(updated);
        saveDashData(updated);
    };

    const handleReorder = (newCardList) => {
        const updated = {
            ...cards,
            [selectedTab]: newCardList,
        };
        setCards(updated);
        saveDashData(updated);
    };

    const saveDashData = (newTabs) => {
        updateDashDataHandler(dashData?.overall ?? [], newTabs);
    };

    return (
        <div className="tab-container">
            <div className="tab-headers">
                <ul className="tab-header">
                    {tabs.map((tab) => (
                        <li 
                            key={tab.id} 
                            className={selectedTab === tab.id ? "active" : ""}
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={selectedTab === tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className="tab-button"
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="tab-content">
                <div className="section-header-end">    
                    <button 
                        type="button"
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