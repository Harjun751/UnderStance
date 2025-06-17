import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import "./LoginPage.css";
import LoginButton from "./LoginButton";
import Title from "../general/Title";



export default () => {

    const { isAuthenticated } = useAuth0();

    if (isAuthenticated) {
        return <Navigate to="/home" />;
    };


    return (
        <div id="login">
            <div id="title-container">
                <Title />
            </div>
            <div id="login-btn">
                <LoginButton />
            </div>
        </div>
    );
};
