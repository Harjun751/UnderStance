import "./Loader.css";

export default ({ message, style }) => {
    return (
        <div className="loader-container">
            <div style={style}>
                <span className="loader"></span>
                <h3>{message}</h3>
            </div>
        </div>
    );
};
