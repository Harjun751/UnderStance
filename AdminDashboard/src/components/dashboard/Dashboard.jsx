import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "../general/Layout";
import { MdSpaceDashboard } from "react-icons/md";
import Loader from "../general/Loader";
import { useAPIClient } from "../api/useAPIClient";
import "./Dashboard.css";
import OverallSection from "./OverallSection";
import TabSection from "./TabSection";
import AnalyticsSection from "./AnalyticsSection";

const Dashboard = () => {
    const [authInfo, setAuthInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [parties, setParties] = useState([]);
    const [stances, setStances] = useState([]);

    const apiClient = useAPIClient();


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

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            apiClient.getQuestions(), 
            apiClient.getCategories(), 
            apiClient.getParties(), 
            apiClient.getStances()
        ]).then(
            ([questions, categories, parties, stances]) => {
                if (!cancelled) {
                    setQuestions(questions);
                    setCategories(categories);
                    setParties(parties)
                    setStances(stances)
                    setIsLoading(false);
                }
            },
        );
        return () => {
            cancelled = true;
        };
    }, [apiClient]);

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
            <div className="dashboard">
                <OverallSection 
                    questions={questions}
                    categories={categories}
                    parties={parties}
                    stances={stances}
                />
                <TabSection 
                    questions={questions}
                    categories={categories}
                    parties={parties}
                    stances={stances}
                />
                <AnalyticsSection 
                    data={[
                        {
                            date: "20250704",
                            activeUsers: "3",
                            newUsers: "3",
                            sessions: "4",
                            screenPageViews: "24"
                        },
                        {
                            date: "20250705",
                            activeUsers: "5",
                            newUsers: "1",
                            sessions: "5",
                            screenPageViews: "30"
                        },
                        {
                            date: "20250706",
                            activeUsers: "2",
                            newUsers: "2",
                            sessions: "3",
                            screenPageViews: "5"
                        },
                        {
                            date: "20250707",
                            activeUsers: "3",
                            newUsers: "2",
                            sessions: "6",
                            screenPageViews: "15"
                        },
                    ]}
                />
            </div>
        </Layout>

        // <Layout
        //     title={
        //         <>
        //             <MdSpaceDashboard /> Dashboard
        //         </>
        //     }
        // >
        //     <div>
        //         Hi, you're logged in and authenticated with the token:{" "}
        //         {authInfo.token}
        //     </div>
        // </Layout>
    );
};

export default Dashboard;
