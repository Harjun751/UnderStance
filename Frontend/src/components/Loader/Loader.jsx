import "./Loader.css";
const Loader = ({ message, style }) => {
    return (
        <div className="loader-container" style={style}>
            <div className="loader"></div>
            <h3>{message}</h3>
        </div>
    );
};

export default Loader;
