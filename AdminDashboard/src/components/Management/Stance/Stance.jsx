import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";

const Stance = () => {
    const [stances, setStances] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            apiClient.getStances(),
            apiClient.getParties(),
            apiClient.getQuestions(),
        ]).then(([stances, parties, questions]) => {
            if (!cancelled) {
                setStances(stances);
                setParties(parties);
                setQuestions(questions);
                setIsLoading(false);
            }

        });

        return () => {
            cancelled = true;
        };
    }, []);



    const schema = [
        { name: "StanceID", type: "id", filterable: false },
        { name: "Stand", type: "boolean", filterable: true },
        { name: "Reason", type: "string", maxLen:1000, filterable: false },
        { name: "Issue Summary", type: "dropdown", filterable: true, dropdownData: {
            key: "IssueID",
            value: "Summary",
            data: []
        }},
        { name: "Party", type: "dropdown", filterable: true, dropdownData: {
            key: "PartyID",
            value: "Name",
            data: []
        }}
    ];

    return (
        <Management_Layout
            title={<>Stance</>}
            data={stances}
            schema={schema}
            isLoading={isLoading}
        />
    );
};

export default Stance;
