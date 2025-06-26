import LogoutButton from "../auth/LogoutButton";
import "./TopBar.css";

const TopBar = () => {
    return (
        <nav>
            <span>this is the navbar :)</span>
            <ul>
                <LogoutButton />
            </ul>
        </nav>
    );
};

export default TopBar;
