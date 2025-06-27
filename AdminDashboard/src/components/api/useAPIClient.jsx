import { useState, useEffect } from 'react';
import { createAPIClient } from "./APIClient";
import { useAuth0 } from "@auth0/auth0-react";

export function useAPIClient() {
    const { getAccessTokenSilently } = useAuth0();
    return createAPIClient(getAccessTokenSilently);
}
