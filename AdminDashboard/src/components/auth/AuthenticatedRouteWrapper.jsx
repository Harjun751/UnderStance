/*          Authenticated Route Wrapper
 * Wrapper to redirect users to login page if they are
 * not authenticated for routes requiring authentication */
import { withAuthenticationRequired } from "@auth0/auth0-react";

const base = ({ children }) => {
    return <>{children}</>;
};

export default withAuthenticationRequired(base, {
    onRedirecting: () => (
        <Loader
            message="Redirecting you to the login page..."
            style={{ marginTop: "100px" }}
        />
    ),
});
