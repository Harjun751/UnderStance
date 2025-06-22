import { useEffect, useState, useId } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./Quiz.css";
import { useNavigate } from "react-router-dom";
import WeightageSlider from "../WeightageSlider/WeightageSlider";
//import { useId } from "react";

const Quiz = () => {
    //
    const [issues, setIssues] = useState([]); // State to store quiz questions
    const [error, setError] = useState(null); // State to store any errors during fetch

    const [currentIndex, setCurrentIndex] = useState(0); // Current index of the question the user is on
    const [answers, setAnswers] = useState({}); // Object to store user's answers: { questionIndex: answer }

    const [showConfirmation, setShowConfirmation] = useState(false); // Controls visibility of the confirmation modal
    const navigate = useNavigate(); // Hook from React Router for navigation

    const [weightage, setWeightage] = useState(3); // State to store Weightage
    
    //useId
    const id = useId();

    // Fetch questions on component mount
    useEffect(() => {
        // fetch('/questions') //for development
        fetch(`${import.meta.env.VITE_API_URL}/questions`)
            // fetch('https://understance-backend.onrender.com/questions') //debugging
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => setIssues(data)) // Store fetched questions in state
            .catch((err) => setError(err.message)); // Store any fetch error
    }, []);

    useEffect(() => {
        void currentIndex;
        setWeightage(3); // Auto-reset weightage when question changes
    }, [currentIndex]);

    // Handles user's answer selection
    const handleAnswer = (answerType) => {
        const isLast = currentIndex === issues.length - 1;

        setAnswers((prev) => {
            const updated = {
                ...prev,
                [currentIssue.IssueID]: {
                    answer: answerType,
                    weightage: answerType === "skip" ? 0 : weightage,
                },
            };

            // If this is the last question, show confirmation
            // Else move to next question if not last
            if (isLast) {
                setShowConfirmation(true);
            } else {
                setCurrentIndex(currentIndex + 1);
            }

            return updated;
        });
    };

    // Navigate to previous question
    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Navigate to next question (only if already answered)
    const handleForward = () => {
        if (
            currentIndex < issues.length - 1 &&
            answers[currentIndex + 1] !== undefined
        ) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Render error or loading states
    if (error) return <div className="content">Error: {error}</div>;
    if (!issues.length) {
        return (
            <div className="content">
                Loading... The servers are all free-tier so the loading might be
                pretty long, give it patience :)
            </div>
        );
    }

    // Get current question and selected answer
    const currentIssue = issues[currentIndex];
    const selected = answers[currentIssue.IssueID]?.answer;

    //useId
    //const id = useId();
    return (
        <div className="quiz">
            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Submit Quiz?</h2>
                        <p>Are you sure you want to submit your answers?</p>
                        <div className="modal-buttons">
                            <button
                                type="button"
                                onClick={() => {
                                    window.localStorage.setItem(
                                        "quizAnswers",
                                        JSON.stringify(answers),
                                    );
                                    navigate("/read-stances", {
                                        state: { answers },
                                    });
                                }}
                            >
                                Yes, Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Question Display */}
            <div className="content">
                <div id={`${id}-content-container`} key={currentIssue.IssueID}>
                    <h2>
                        Question {currentIndex + 1}/{issues.length}
                    </h2>
                    <div className="quote-container">
                        <span className="big-quote main-question">
                            {currentIssue.Description}
                        </span>
                    </div>
                    <div className="button-group">
                        {["disagree", "skip", "agree"].map((option) => (
                            <button
                                type="button"
                                key={option}
                                className={`btn ${option} ${selected === option ? "selected" : ""}`}
                                onClick={() => handleAnswer(option)}
                            >
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </button>
                        ))}
                    </div>
                    <WeightageSlider
                        value={weightage}
                        onChange={setWeightage}
                    />
                    <div className="control-btns">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={handleBack}
                            disabled={currentIndex === 0}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="forward-btn"
                            onClick={handleForward}
                            disabled={answers[currentIndex + 1] === undefined}
                        >
                            Forward
                        </button>
                    </div>
                </div>
                <ProgressBar progress={currentIndex / issues.length} />
                <footer />
            </div>
        </div>
    );
};

export default Quiz;
