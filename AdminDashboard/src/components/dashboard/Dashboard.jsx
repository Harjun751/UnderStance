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
    const [_authInfo, setAuthInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [parties, setParties] = useState([]);
    const [stances, setStances] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [dashInfo, setDashInfo] = useState([]);

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

            const dashRes = await fetch(
                `${import.meta.env.VITE_API_URL}/me/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const initData = await dashRes.json();
            // console.log("Init Data:" + initData);
            const dashData = {
                overall: Array.isArray(initData?.Overall) ? initData.Overall : [],
                tabs: initData?.Tabs ?? {}
            };
            // console.log("Dash Data:" + dashData)
            setDashInfo(dashData);

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
            apiClient.getStances(),
            apiClient.getAnalytics(),
        ]).then(
            ([questions, categories, parties, stances, analytics]) => {
                if (!cancelled) {
                    setQuestions(questions);
                    setCategories(categories);
                    setParties(parties);
                    setStances(stances);
                    setAnalytics(analytics);
                    //setIsLoading(false);
                    setLoading(false);
                }
            },
        );
        return () => {
            cancelled = true;
        };
    }, [apiClient]);

    const updateDashDataHandler = async (overall, tabs) => {
        const updated = await apiClient.updateDashData(overall, tabs);
        setDashInfo({
            overall: Array.isArray(updated.Overall) ? updated.Overall : [],
            tabs: typeof updated.Tabs === "object" && updated.Tabs !== null ? updated.Tabs : {}
        });
    };

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
            {/* <div>
                <p>Dash Data: {dashInfo}</p>
            </div> */}
            <div className="dashboard">
                <OverallSection 
                    questions={questions}
                    categories={categories}
                    parties={parties}
                    stances={stances}
                    dashData={dashInfo}
                    updateDashDataHandler={updateDashDataHandler}
                />
                <TabSection 
                    questions={questions}
                    categories={categories}
                    parties={parties}
                    stances={stances}
                    dashData={dashInfo}
                    updateDashDataHandler={updateDashDataHandler}
                />
                <AnalyticsSection
                    initData={analytics} 
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
