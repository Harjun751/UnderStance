import "./LoginButton.css";
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
    const { _isAuthenticated, loginWithRedirect } = useAuth0();

    return (
        <>
            <button
                onClick={loginWithRedirect}
                class="login-button"
                type="submit"
            >
                Login
            </button>
        </>
    );
};
