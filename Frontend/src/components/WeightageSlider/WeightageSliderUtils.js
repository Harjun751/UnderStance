// Importance Label for Weightage slider
export const importanceLabels = {
    1: "Lowest Importance",
    2: "Low Importance",
    3: "Moderate Importance",
    4: "High Importance",
    5: "Highest Importance",
};


export const importanceColors = {
    1: "#ccc",
    2: "#6ba4ff",
    3: "#f3c623",
    4: "#ff914d",
    5: "#d62828",
};

// Function to return different colour based on Weightage slider status
export const getSliderBackground = (value) =>
    `linear-gradient(to right, ${importanceColors[value]} 0%, ${importanceColors[value]} ${
        (value - 1) * 25
    }%, #e0e0e0 ${(value - 1) * 25}%, #e0e0e0 100%)`;