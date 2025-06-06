/* Adapted from https://alvarotrigo.com/blog/hamburger-menu-css/ */

import "./Hamburger.css";
export default function Hamburger({ onClick, className }) {
    return (
        <div onClick={onClick} className={className}>
            <input
                className="hamburger-checkbox"
                type="checkbox"
                name=""
                id=""
            />
            <div className="hamburger-lines">
                <span className="line line1"></span>
                <span className="line line2"></span>
                <span className="line line3"></span>
            </div>
        </div>
    );
}
