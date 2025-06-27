import "./Header.css";
import { FaUser } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

const Header = ({ Title }) => {
    const { user } = useAuth0();
    return (
        <header className="header">
            <h1 className="header-title">
                <span className="header-icon-text">{Title}</span>
            </h1>
            <div className="header-right">
                <div className="user-info">
                    <div className="user-details">{user.name}</div>
                    <div className="user-icon">
                        <img src={user.picture} alt={<FaUser />} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
