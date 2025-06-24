
import './Header.css';
import { FaUser } from "react-icons/fa";

const Header = ({ Title }) => {
  return (
    <header className="header">
      <h1 className="header-title">
        <span className="header-icon-text">
            {Title}
        </span>
    </h1>
        <div className="header-right">
            <div className="user-info">
                <div className="user-details">
                    Admin Placeholder User  {/* Implement actual username later */}
                </div>
                <div className="user-icon">
                    <FaUser /> {/* Implement actual username later */}
                </div>
            </div> 
        </div>
    </header>
  );
}

export default Header;