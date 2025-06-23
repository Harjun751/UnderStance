/* Adapted from https://alvarotrigo.com/blog/hamburger-menu-css/ */

import { useId } from "react";
import "./Hamburger.css";
export default function Hamburger({ onClick, className }) {
    const id = useId();
    return (
        <button
            type="button"
            onKeyPress={onClick}
            onClick={onClick}
            className={`ham-button bg-transparent ${className}`}
        >
            <input
                className="hamburger-checkbox"
                type="checkbox"
                name=""
                id={id}
            />
            <div className="hamburger-lines">
                <span className="line line1" />
                <span className="line line2" />
                <span className="line line3" />
            </div>
        </button>
    );
}
