import { useAuth0 } from "@auth0/auth0-react";

export default () => {
    const { _isAuthenticated, logout } = useAuth0();

    return (
        <>
            <button
                onClick={() => {
                    logout({
                        logoutParams: {
                            returnTo: window.location.origin,
                        },
                    });
                }}
                className="logout-button"
                type="submit"
            >
                Logout
            </button>
        </>
    );
};
