import "./Loader.css"
const Loader = ({ message, style }) => {
    return (
        /*<div className="loader-container">
            <div style={style}>
                <span className="loader"></span>
                <h3>{message}</h3>
            </div>
        </div>*/
        <div className="loader-container">
             <div className="loader"></div>
            <h3>Loading...</h3>
        </div>
    );
};


export default Loader;
