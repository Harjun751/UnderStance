import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";

const Party = () => {
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    useEffect(() => {
        // ignore var to prevent race condition
        let ignore = false;

        apiClient.getParties().then(result => {
            if (!ignore) {
                setParties(result);
                setIsLoading(false);
            }
        });

        return () => {
           ignore = true; 
        };
    }, []);



    const schema = [
        { name: "PartyID", type: "id", filterable: false },
        { name: "Name", type: "string", maxLen:100, filterable: false },
        { name: "ShortName", type: "string", maxLen:5, filterable: false },
        { name: "Icon", type: "image", maxLen:2083, filterable: false },
        { name: "PartyColor", type: "color", filterable: false },
    ];

    return (
        <Management_Layout
            title={<> Party </>}
            data={parties}
            schema={schema}
            isLoading={isLoading}
        />
    );
};

export default Party;
