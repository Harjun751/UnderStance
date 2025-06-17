import { useState } from "react";
import "./LoginButton.css";
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    return (
        <>
            <button onClick={loginWithRedirect} id="login-button" type="submit">
                Login
            </button>
        </>
    );
};
