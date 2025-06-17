import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';

export default () => {
    const { 
        isAuthenticated,
        logout,
    } = useAuth0();

    return (
        <>
            <button onClick={() => {
                logout({
                    logoutParams: {
                        returnTo: window.location.origin
                    }
                });
            }} id="logout-button" type="submit">
                Logout
            </button>
        </>
    );
};
