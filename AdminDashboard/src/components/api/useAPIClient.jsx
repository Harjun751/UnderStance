import { useMemo } from "react";
import { createAPIClient } from "./APIClient";
import { useAuth0 } from "@auth0/auth0-react";

export function useAPIClient() {
    const { user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
    const apiClient = useMemo(() => {
        return createAPIClient(getAccessTokenSilently, getAccessTokenWithPopup, user.sub);
    }, [getAccessTokenSilently]); // re-run only if the Auth0 getter changes

    return apiClient;
}
