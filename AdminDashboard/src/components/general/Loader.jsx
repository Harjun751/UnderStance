import "./Loader.css";

export default ({ message, style }) => {
    return (
        <div class="loader-container">
            <div style={style}>
                <span class="loader"></span>
                <h3>{message}</h3>
            </div>
        </div>
    );
};
