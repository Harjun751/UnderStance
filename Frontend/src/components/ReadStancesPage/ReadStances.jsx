import { useEffect, useState } from "react";
import "./ReadStances.css";
import AlignmentChart from "./AlignmentChart";
import SearchBar from "./SearchBar";
import StanceItem from "./StanceItem";
import { useLocation } from "react-router-dom";
import {
    importanceLabels,
    importanceColors,
} from "../WeightageSlider/WeightageSliderUtils";

const ReadStances = () => {
    const [stances, setStances] = useState([]);
    // State for parties
    const [parties, setParties] = useState([]);
    // State for questions/issues
    const [questions, setQuestions] = useState([]);
    // state for searching
    const [searchVal, setSearch] = useState("");
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
        document
            .querySelector(`.question-container[issueid='${issueId}']`)
            .scroll(0, 0);
    };

    // Retrieve user answers passed via navigation state
    const location = useLocation();
    const userAnswers =
        location.state?.answers ||
        JSON.parse(window.localStorage.getItem("quizAnswers") || "{}");

    // Show loading or error messages before rendering data
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="content">
            <div
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
                <ul className={`question-containers`}>
                    {questions.map((question, index) => {
                        // Filter stances for this question
                        const stancesForQuestion = stances.filter(
                            (s) => s.IssueID === question.IssueID,
                        );

                        // Check if search matches description/summary
                        const isFilteredOut =
                            !question.Description.toLowerCase().includes(
                                searchVal,
                            ) &&
                            !question.Summary.toLowerCase().includes(searchVal);

                        return (
                            <li
                                key={question.IssueID}
                                className={`
                                question-container
                                ${expandedQuestionId === question.IssueID ? "expanded" : ""}
                                ${isFilteredOut ? "hide" : ""}
                            `}
                                issueid={question.IssueID}
                                onKeyPress={() =>
                                    toggleExpand(question.IssueID)
                                }
                                onClick={() => toggleExpand(question.IssueID)}
                            >
                                <div className="question-header">
                                    {/* allow selection of header text only if this container is expanded */}
                                    <h2
                                        onClick={(e) => {
                                            if (
                                                expandedQuestionId ===
                                                question.IssueID
                                            ) {
                                                e.stopPropagation();
                                            }
                                        }}
                                        onKeyPress={() => {}}
                                    >
                                        Q{index+1}:{" "}
                                        {question.Description}
                                    </h2>
                                    <div className="header-right">
                                        {userAnswers[question.IssueID]
                                            ?.answer && (
                                            <span
                                                className={`user-answer ${
                                                    userAnswers[
                                                        question.IssueID
                                                    ].answer === "agree"
                                                        ? "agree"
                                                        : userAnswers[
                                                                question.IssueID
                                                            ].answer ===
                                                            "disagree"
                                                          ? "disagree"
                                                          : "skip"
                                                }`}
                                            >
                                                {userAnswers[
                                                    question.IssueID
                                                ].answer
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    userAnswers[
                                                        question.IssueID
                                                    ].answer.slice(1)}
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
                                    const userResponse =
                                        userAnswers[question.IssueID];
                                    const userAnswer = userResponse?.answer;

                                    const matchingParties = parties.filter(
                                        (party) => {
                                            const stance =
                                                stancesForQuestion.find(
                                                    (s) =>
                                                        s.PartyID ===
                                                        party.PartyID,
                                                );
                                            if (
                                                !stance ||
                                                userAnswer === "skip"
                                            )
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
                                                    <button
                                                        className="alignment-info"
                                                        type="button"
                                                        onKeyPress={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        {matchingParties.length >
                                                        0 ? (
                                                            <>
                                                                Your Stance
                                                                aligns with the:{" "}
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
                                                        <br />
                                                        You indicated that this
                                                        issue was of
                                                        <strong
                                                            style={{
                                                                color:
                                                                    importanceColors[
                                                                        userResponse
                                                                            ?.weightage
                                                                    ] ||
                                                                    "inherit",
                                                            }}
                                                        >
                                                            {`·${
                                                                importanceLabels[
                                                                    userResponse
                                                                        ?.weightage
                                                                ]
                                                            }`}
                                                        </strong>
                                                    </button>
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
                                                userAnswerForQuestion={
                                                    userResponse
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
