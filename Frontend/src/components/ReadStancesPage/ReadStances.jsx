import { React, useEffect, useState } from "react";
import "./ReadStances.css";
import AlignmentChart from "./AlignmentChart";
import StanceItem from "./StanceItem";
import { useLocation } from "react-router-dom";

const ReadStances = () => {
    const [stances, setStances] = useState([]);
    // State for parties
    const [parties, setParties] = useState([]);
    // State for questions/issues
    const [questions, setQuestions] = useState([]);

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

                <h1>Stance Breakdown</h1>

                {questions.map((question) => {
                    // Filter stances for this question
                    const stancesForQuestion = stances.filter(
                        (s) => s.IssueID === question.IssueID,
                    );

                    return (
                        <div
                            key={question.IssueID}
                            className={`question-container ${expandedQuestionId === question.IssueID ? "expanded" : ""}`}
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReadStances;
