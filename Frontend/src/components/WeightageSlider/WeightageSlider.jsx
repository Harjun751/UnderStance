import React from "react";
import "./WeightageSlider.css"

// Importance Label for Weightage slider
const importanceLabels = {
    1: "Lowest Importance",
    2: "Low Importance",
    3: "Moderate Importance",
    4: "High Importance",
    5: "Highest Importance",
};

// Function to return different colour based on Weightage slider status
const getSliderBackground = (value) => {
    const colors = {
        1: "#ccc", // Gray - Lowest
        2: "#6ba4ff", // Blue - Low
        3: "#f3c623", // Yellow - Moderate
        4: "#ff914d", // Orange - High
        5: "#d62828", // Red - Highest
    };

    return `linear-gradient(to right, ${colors[value]} 0%, ${colors[value]} ${(value - 1) * 25}%, #e0e0e0 ${(value - 1) * 25}%, #e0e0e0 100%)`;
};

const WeightageSlider = ({value, onChange}) => {
    return (
        <div className="weightage-slider">
            <label htmlFor="weightage" className="weightage-label">
                Weightage: <br />
                <strong>{importanceLabels[value]}</strong>
            </label>
            <input
                type="range"
                id="weightage"
                min="1"
                max="5"
                step="1"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ background: getSliderBackground(value) }}
            />
        </div>
    )
}

export default WeightageSlider;