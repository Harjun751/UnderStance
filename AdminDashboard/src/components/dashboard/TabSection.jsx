import "./TabSection.css";
import "./Dashboard.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import CardDisplay from "./CardDisplay";

const TabSection = ({ questions, categories, parties, stances }) => {
    const [selectedTab, setSelectedTab] = useState("quiz");

    const tabs = [
        { id: "quiz", label: "Quiz" },
        { id: "category", label: "Category" },
        { id: "party", label: "Party" },
        { id: "stance", label: "Stance" },
    ];

    // Load user's display cards set.
    const [cards, setCards] = useState([
        {
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
            ],
        }
    ]);

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
                <CardDisplay 
                    cards={cards[0][selectedTab]}
                    dataMap={{ questions, categories, parties, stances }}
                />
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