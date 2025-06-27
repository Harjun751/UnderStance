import { Navigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import "./LoginPage.css";
import LoginButton from "./LoginButton";
import Title from "../general/Title";

export default () => {
    const { isAuthenticated } = useAuth0();

    if (isAuthenticated) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="login-container">
            <div className="title-container">
                <Title />
            </div>
            <div className="login-btn">
                <LoginButton />
            </div>
        </div>
    );
};
