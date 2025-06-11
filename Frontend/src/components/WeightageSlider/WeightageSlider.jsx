import React from "react";
import "./WeightageSlider.css"

// Importance Label for Weightage slider
export const importanceLabels = {
    1: "Lowest Importance",
    2: "Low Importance",
    3: "Moderate Importance",
    4: "High Importance",
    5: "Highest Importance",
};

export const importanceColors = {
    1: "#ccc",      // Gray - Lowest
    2: "#6ba4ff",   // Blue - Low
    3: "#f3c623",   // Yellow - Moderate
    4: "#ff914d",   // Orange - High
    5: "#d62828",   // Red - Highest
};

// Function to return different colour based on Weightage slider status
const getSliderBackground = (value) => {
    return `linear-gradient(to right, ${importanceColors[value]} 0%, ${importanceColors[value]} ${(value - 1) * 25}%, #e0e0e0 ${(value - 1) * 25}%, #e0e0e0 100%)`;
};

const WeightageSlider = ({value, onChange}) => {
    return (
        <div className="weightage-slider">
            <div className="slider-container">
                <input
                    type="range"
                    id="weightage"
                    min="1"
                    max="5"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ background: getSliderBackground(value) }}
                    className="slider"
                />
                <div className="tooltip">Slide to indicate how importance this issue is to you!</div>
                <label htmlFor="weightage" className="weightage-label">
                    <strong>{importanceLabels[value]}</strong>
                </label>
            </div>
        </div>
    )
}

export default WeightageSlider;