import Layout from "../general/Layout";
import Loader from "../general/Loader";
import ErrorModal from "../general/ErrorModal";
import { useAPIClient } from "../api/useAPIClient";
import { useState, useEffect } from "react";

const Settings = () => {
    const loading = false;
    const apiClient = useAPIClient();
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch the user data and populate
    useEffect(() => {
        let ignore = false;

        apiClient.getUserInfo().then((result) => {
            if (!ignore) {
                setUserData(result.data);
                setIsLoading(false);
            }
        }).catch((err) => {
            setIsLoading(false);
            setError(err);
        });

        return () => {
            ignore = true;
        };
    }, [apiClient]);



    if (loading)
        return (
            <Layout
                title={
                    <>
                        Settings
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
                    Settings
                </>
            }
        >
            {isLoading ? (
                <Loader message="Loading data..."/>
            ) : (<></>)}
            <ErrorModal error={error}/>
            <div>
                This is the epic settings page.
                { userData.name }
            </div>
        </Layout>
    );
};

export default Settings;
