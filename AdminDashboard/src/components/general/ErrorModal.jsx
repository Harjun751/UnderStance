import { useState, useEffect } from "react";
import { IoIosWarning } from "react-icons/io";
import "./ErrorModal.css";

export default ({ error }) => {
    const [show, setShow] = useState(true);
    const [header, setHeader] = useState("");
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");

    useEffect(() => {
        if (error !== null) {
            if (error?.response?.data?.error) {
                // Alert with details given from backend
                const info = error.response.data;
                if (info.details) {
                    setHeader(info.error);
                    setDetails(info.details);
                } else {
                    setHeader(info.error);
                }
            } else if (error?.message) {
                // Other error just fill message
                setHeader(error.message);
            }

            if (error?.status >= 500) {
                setTitle("There's an issue on our side...");
            } else {
                setTitle("There was an issue with your request");
            }
        }
        // reset show state on error value change
        setShow(true);
    }, [error]);

    if (error !== null && show) {
        return (
            <div className="modal error-modal">
                <div className="error-modal-content">
                    <button type="button" onClick={() => setShow(false)}>
                        &times;
                    </button>
                    <IoIosWarning />
                    <h1>{title}</h1>
                    <h2 class="error-header">{header}</h2>
                    {details !== "" && (
                        <p class="error-details">
                            Additional details:
                            <br />
                            {details}
                        </p>
                    )}
                </div>
            </div>
        );
    }
};
