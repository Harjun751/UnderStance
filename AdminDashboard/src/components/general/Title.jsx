import "./Title.css";
import { FaBuildingColumns } from "react-icons/fa6";

export default () => {
    return (
        <h1 className="title">
            <span>
                <FaBuildingColumns />
            </span>
            <span>Under</span>
            <span>Stance</span>
        </h1>
    );
};
