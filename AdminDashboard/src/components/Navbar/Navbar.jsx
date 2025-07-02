import "./Navbar.css";
import { FaBuildingColumns } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { GiInjustice } from "react-icons/gi";
import { MdQuiz, MdSpaceDashboard } from "react-icons/md";
import { FaFlag, FaUser } from "react-icons/fa";
import { SiGoogleanalytics } from "react-icons/si";
import {
    IoMdArrowDropright,
    IoMdArrowDropleft,
    IoMdSettings,
} from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { usePermissions } from "../general/usePermissions";
// LE WALL OF IMPORTS

const Navbar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const permissions = usePermissions();
    const togglenavbar = () => {
        setCollapsed((prev) => !prev);
    };
    const { logout } = useAuth0();

    return (
        <div className={`navbar ${collapsed ? "collapsed" : ""}`}>
            <div className="navbar-header">
                <div className="navbar-logo">
                    <FaBuildingColumns />
                </div>
                {!collapsed && <span className="logo-text">UnderStance</span>}
            </div>

            <div className="navbar-content">
                {/* Home */}
                <div className="navbar-section">
                    <div className="navbar-title">
                        <h3>Home</h3>
                        <button
                            type="button"
                            className="toggle-button"
                            onClick={togglenavbar}
                            aria-label={
                                collapsed ? "Expand Navbar" : "Collapse Navbar"
                            }
                        >
                            {collapsed ? (
                                <IoMdArrowDropleft />
                            ) : (
                                <IoMdArrowDropright />
                            )}
                        </button>
                    </div>
                </div>

                <nav className="navbar-list">
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `nav-item ${isActive ? "active" : ""}`
                        }
                        onClick={togglenavbar}
                    >
                        <MdSpaceDashboard />
                        {!collapsed && (
                            <span className="nav-text">Dashboard</span>
                        )}
                    </NavLink>
                    <NavLink to="/analytics" className="nav-item">
                        <SiGoogleanalytics />
                        {!collapsed && (
                            <span className="nav-text">Analytics</span>
                        )}
                    </NavLink>
                </nav>

                {/* Management */}
                <div className="navbar-section">
                    <div className="navbar-title">
                        <h3>Management</h3>
                    </div>
                </div>
                <nav className="navbar-list">
                    <NavLink to="/category" className="nav-item">
                        <BiSolidCategoryAlt />
                        {!collapsed && (
                            <span className="nav-text">Category</span>
                        )}
                    </NavLink>
                    <NavLink to="/quiz" className="nav-item">
                        <MdQuiz />
                        {!collapsed && <span className="nav-text">Quiz</span>}
                    </NavLink>
                    <NavLink to="/stance" className="nav-item">
                        <GiInjustice />
                        {!collapsed && <span className="nav-text">Stance</span>}
                    </NavLink>
                    <NavLink to="/party" className="nav-item">
                        <FaFlag />
                        {!collapsed && <span className="nav-text">Party</span>}
                    </NavLink>
                    { permissions.includes("read:users") ?
                    <NavLink to="/user" className="nav-item">
                        <FaUser />
                        {!collapsed && <span className="nav-text">User</span>}
                    </NavLink> : <></>}
                </nav>
            </div>

            {/* Footer */}
            <div className="navbar-footer">
                {/* Account */}
                <div className="navbar-section">
                    <div className="navbar-title">
                        <h3>Account</h3>
                    </div>
                </div>
                <NavLink to="/settings" className="nav-btn">
                    <button type="button" className="footer-button">
                        <IoMdSettings />
                        {!collapsed && <span className="nav-text">Settings</span>}
                    </button>
                </NavLink>
                <button
                    type="button"
                    className="footer-button"
                    onClick={() => {
                        logout({
                            logoutParams: {
                                returnTo: window.location.origin,
                            },
                        });
                    }}
                >
                    <TbLogout2 />
                    {!collapsed && <span className="nav-text">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Navbar;
