import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "../general/Layout";
import { MdSpaceDashboard } from "react-icons/md";
import Loader from "../general/Loader";

const Dashboard = () => {
    const [authInfo, setAuthInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
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

    if (loading)
        return (
            <Layout
                title={
                    <>
                        <MdSpaceDashboard /> Dashboard
                    </>
                }
            >
                <Loader message="Loading data..." />
            </Layout>
        );

    return (
        <Layout
            title={
                <>
                    <MdSpaceDashboard /> Dashboard
                </>
            }
        >
            <div>
                Hi, you're logged in and authenticated with the token:{" "}
                {authInfo.token}
            </div>
        </Layout>
    );
};

export default Dashboard;
