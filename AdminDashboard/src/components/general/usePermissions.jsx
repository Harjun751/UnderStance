import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";

export const usePermissions = () => {
    const { getAccessTokenSilently, _isAuthenticated } = useAuth0();
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const token = await getAccessTokenSilently();
                const decoded = jwtDecode(token);
                setPermissions(decoded.permissions || []);
            } catch (err) {
                console.error("Error fetching permissions", err);
            }
        };

        fetchPermissions();
    }, [getAccessTokenSilently]);

    return permissions;
};
