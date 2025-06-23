import { useId } from "react";
import "./WeightageSlider.css";
import { importanceLabels, getSliderBackground } from "./WeightageSliderUtils";

const WeightageSlider = ({ value, onChange }) => {
    const id = useId();
    return (
        <div className="weightage-slider">
            <div className="slider-container">
                <input
                    type="range"
                    id={`weightage-${id}`}
                    min="1"
                    max="5"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ background: getSliderBackground(value) }}
                    className="slider"
                />
                <div className="tooltip">
                    Slide to indicate how importance this issue is to you!
                </div>
                <label htmlFor="weightage" className="weightage-label">
                    <strong>{importanceLabels[value]}</strong>
                </label>
            </div>
        </div>
    );
};

export default WeightageSlider;
