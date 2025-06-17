import LogoutButton from "../auth/LogoutButton";
import "./TopBar.css";

export default () => {
    return (
        <nav>
            <span>this is the navbar :)</span>
            <ul>
                <LogoutButton />
            </ul>
        </nav>
    );
};
