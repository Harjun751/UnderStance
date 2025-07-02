import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { GoSkip } from "react-icons/go";
import WeightageSlider from "../WeightageSlider/WeightageSlider";
import "./WeightageTuning.css";

const AnswerButtons = ({ currentAnswer, onChange }) => {
    const options = ["agree", "skip", "disagree"];
    const icons = {
        agree: <FaCheck />,
        disagree: <FaTimes />,
        skip: <GoSkip />,
    };

    return (
        <div className="answer-buttons">
            {options.map((option) => (
                <button
                    key={option}
                    className={`answer-btn ${option} ${
                        currentAnswer === option ? "selected" : ""
                    }`}
                    onClick={() => onChange(option)}
                >
                    {icons[option]} 
                </button>
            ))}
        </div>
    );
};

const WeightageTuning = ({ questions, userAnswers, onSubmit, onClose }) => {
    const [editableAnswers, setEditableAnswers] = useState({ ...userAnswers });

    useEffect(() => {
        setEditableAnswers({ ...userAnswers });
    }, [userAnswers]);

    const handleSubmit = () => {
        if (typeof onSubmit === "function") {
            onSubmit(editableAnswers);
        }
        if (typeof onClose === "function") {
            onClose();
        }
    };

    return (
        <div className="weightage-tuning">
            <h2>Fine-tune Your Answers</h2>
            <div className="tuning-container">
                {questions.map((question) => {
                    const current = editableAnswers[question.IssueID];
                    if (!current) return null;

                    return (
                        <div
                            key={question.IssueID}
                            className="tuning-card"
                        >
                            <h3>{question.Description}</h3>
                            <div className="card-details">
                                <AnswerButtons
                                    currentAnswer={current.answer}
                                    onChange={(newAnswer) =>
                                        setEditableAnswers((prev) => ({
                                            ...prev,
                                            [question.IssueID]: {
                                                ...prev[question.IssueID],
                                                answer: newAnswer,
                                            },
                                        }))
                                    }
                                />

                                <WeightageSlider
                                    value={current.weightage}
                                    onChange={(newWeight) =>
                                        setEditableAnswers((prev) => ({
                                            ...prev,
                                            [question.IssueID]: {
                                                ...prev[question.IssueID],
                                                weightage: newWeight,
                                            },
                                        }))
                                    }
                                />
                            </div>
                            
                        </div>
                    );
                })}
            </div>

            <div className="submit-updates">
                <button type="submit" className="submit-button" onClick={handleSubmit}>
                    Submit Updates
                </button>
            </div>
        </div>
    );
};

export default WeightageTuning;