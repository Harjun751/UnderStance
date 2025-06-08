import { React, useEffect, useState } from "react";
import "./ReadStances.css";
import AlignmentChart from "./AlignmentChart";
import SearchBar from "./SearchBar";
import StanceItem from "./StanceItem";
import { useLocation } from "react-router-dom";

const ReadStances = () => {
    const [stances, setStances] = useState([]);
    // State for parties
    const [parties, setParties] = useState([]);
    // State for questions/issues
    const [questions, setQuestions] = useState([]);
    // state for searching
    const [searchVal, setSearch] = useState('');
    // State for loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Track which question is currently expanded (by IssueID or index)
    const [expandedQuestionId, setExpandedQuestionId] = useState(null);

    // Fetch all data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stancesRes, partiesRes, questionsRes] =
                    await Promise.all([
                        fetch(`${import.meta.env.VITE_API_URL}/stances`),
                        fetch(`${import.meta.env.VITE_API_URL}/parties`),
                        fetch(`${import.meta.env.VITE_API_URL}/questions`),
                    ]);

                if (!stancesRes.ok || !partiesRes.ok || !questionsRes.ok) {
                    throw new Error("One or more requests failed");
                }

                const [stancesData, partiesData, questionsData] =
                    await Promise.all([
                        stancesRes.json(),
                        partiesRes.json(),
                        questionsRes.json(),
                    ]);

                setStances(stancesData);
                setParties(partiesData);
                setQuestions(questionsData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Toggle expand/collapse of a question container
    const toggleExpand = (issueId) => {
        setExpandedQuestionId(expandedQuestionId === issueId ? null : issueId);
        // Reset scroll of issue on collapse/expand (prevents issue with collapsed and ugly container)
        document.querySelector(`.question-container[issueid='${issueId}']`).scroll(0,0);
    };

    // Show loading or error messages before rendering data
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Retrieve user answers passed via navigation state
    const location = useLocation();
    const userAnswers =
        location.state?.answers ||
        JSON.parse(window.localStorage.getItem("quizAnswers") || "{}");

    return (
        <div className="content">
            <div
                id="content-container"
                className={`read-stances ${Object.keys(userAnswers).length === 0 ? "unanswered" : ""}`}
            >
                <AlignmentChart
                    parties={parties}
                    questions={questions}
                    userAnswers={userAnswers}
                    stances={stances}
                />

                <SearchBar setSearch={setSearch} />
                <h1>Stance Breakdown</h1>
                <ul id="question-containers-container">
                {questions.map((question) => {
                    // Filter stances for this question
                    const stancesForQuestion = stances.filter(
                        (s) => s.IssueID === question.IssueID,
                    );

                    // Check if search matches description/summary
                    const isFilteredOut = (!question.Description.toLowerCase().includes(searchVal) && !question.Summary.toLowerCase().includes(searchVal))

                    return (
                        <li
                            key={question.IssueID}
                            className={`
                                question-container
                                ${expandedQuestionId === question.IssueID ? "expanded" : ""}
                                ${isFilteredOut ? "hide" : ""}
                            `}
                            issueid={question.IssueID}
                            onKeyPress={() => toggleExpand(question.IssueID)}
                            onClick={() => toggleExpand(question.IssueID)}
                        >
                            <div className="question-header">
                                <h2>
                                    Q{question.IssueID}:{" "}
                                    <br className="qn-break" />{" "}
                                    {question.Summary}
                                </h2>
                                <div className="header-right">
                                    {userAnswers[question.IssueID] && (
                                        <span
                                            className={`user-answer ${
                                                userAnswers[
                                                    question.IssueID
                                                ] === "agree"
                                                    ? "agree"
                                                    : userAnswers[
                                                            question.IssueID
                                                        ] === "disagree"
                                                      ? "disagree"
                                                      : "skip"
                                            }`}
                                        >
                                            {userAnswers[question.IssueID]
                                                .charAt(0)
                                                .toUpperCase() +
                                                userAnswers[
                                                    question.IssueID
                                                ].slice(1)}
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        className="toggle-button"
                                    >
                                        ▲
                                    </button>
                                </div>
                            </div>
                            {(() => {
                                const userAnswer =
                                    userAnswers[question.IssueID];
                                const matchingParties = parties.filter(
                                    (party) => {
                                        const stance = stancesForQuestion.find(
                                            (s) => s.PartyID === party.PartyID,
                                        );
                                        if (!stance || userAnswer === "skip")
                                            return false;
                                        return (
                                            (userAnswer === "agree" &&
                                                stance.Stand === true) ||
                                            (userAnswer === "disagree" &&
                                                stance.Stand === false)
                                        );
                                    },
                                );

                                return (
                                    <div
                                        key={question.IssueID}
                                        className="question-details"
                                    >
                                        <div className="full-question-details">
                                            <h3>Full Question</h3>
                                            <p>{question.Description}</p>
                                        </div>
                                        {userAnswer &&
                                            userAnswer !== "skip" && (
                                                <div className="alignment-info">
                                                    {matchingParties.length >
                                                    0 ? (
                                                        <>
                                                            Your Stance aligns
                                                            with the:{" "}
                                                            {matchingParties.map(
                                                                (
                                                                    party,
                                                                    idx,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            party.PartyID
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                party.Name
                                                                            }
                                                                        </strong>
                                                                        {idx <
                                                                        matchingParties.length -
                                                                            1
                                                                            ? ", "
                                                                            : ""}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </>
                                                    ) : (
                                                        "No parties matched your stance on this issue."
                                                    )}
                                                </div>
                                            )}
                                        {userAnswer === "skip" && (
                                            <div className="alignment-info">
                                                You did not answer this
                                                question.
                                            </div>
                                        )}
                                        <StanceItem
                                            parties={parties}
                                            stancesForQuestion={
                                                stancesForQuestion
                                            }
                                        />
                                    </div>
                                );
                            })()}
                        </li>
                    );
                })}
                </ul>
            </div>
        </div>
    );
};

export default ReadStances;
