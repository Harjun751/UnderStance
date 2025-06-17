import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
    const [authInfo, setAuthInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            /* test if normal routes work */
            const testRes = await fetch(
                `${import.meta.env.VITE_API_URL}/questions`,
            );
            const testData = await testRes.json();
            console.log(testData);
            /* end */

            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: "https://understance-backend.onrender.com/",
                },
            });

            const authRes = await fetch(
                `${import.meta.env.VITE_API_URL}/authorized`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const authData = await authRes.json();
            setAuthInfo(authData);
            setLoading(false);
        };
        fetchData();
    }, [getAccessTokenSilently]);

    if (loading) return <div>getting auth info...</div>;

    return (
        <div id="dashboard">
            <TopBar />
            <div>
                Hi, you're logged in and authenticated with the token:{" "}
                {authInfo.token}
            </div>
        </div>
    );
};
