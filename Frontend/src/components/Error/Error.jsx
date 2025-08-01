import "./Error.css";
import { FetchError } from "./FetchError";
import { BiSolidError } from "react-icons/bi";

const ErrorComponent = ({ err }) => {
    let errorInfo = err.message;
    if (err instanceof FetchError) {
        const details = err.details;
        details.message = err.message;
        errorInfo = JSON.stringify(details);
    }

    const bugDetails = {
        useragent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        error: errorInfo,
    };
    const ghUrl = `https://github.com/Harjun751/UnderStance/issues/new?title=Bug Title&body=${encodeURIComponent(JSON.stringify(bugDetails))}+Additional details of the error please...`;
    return (
        <div className="error-container">
            <div className="info">
                <div>
                    <BiSolidError />
                </div>
                <h1>We've had an Error...</h1>
                <details>
                    <summary>Error Info</summary>
                    <p>{errorInfo}</p>
                </details>
                <h2>Submit a bug on Github</h2>
                <a target="_blank" href={ghUrl}>
                    &gt;Create an Issue
                </a>
            </div>
        </div>
    );
};

export default ErrorComponent;
