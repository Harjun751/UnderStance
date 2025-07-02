import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
import { useUpdateSubmitHandler } from "../Hooks/useUpdateSubmitHandler";
import { useAddSubmitHandler } from "../Hooks/useAddSubmitHandler";
import { useDeleteSubmitHandler } from "../Hooks/useDeleteSubmitHandler";

const Stance = () => {
    const [stances, setStances] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [latestError, setLatestError] = useState(null);

    const apiClient = useAPIClient();

    /*           HANDLER HOOKS
     * For updating/adding/submitting data
     * Passes anon functions to general component to call
     */
    // Update data
    const { handleUpdateSubmit, _updateSubmitLoading, _updateSubmitError } =
        useUpdateSubmitHandler({
            updateFunction: (form) =>
                apiClient.updateStance(
                    form.StanceID,
                    form.Stand,
                    form.Reason,
                    form[`Issue SummaryID`],
                    form.PartyID,
                ),
            setResource: setStances,
            key: "StanceID",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });
    // Add data
    const { handleAddSubmit, _addSubmitLoading, _addSubmitError } =
        useAddSubmitHandler({
            addFunction: (form) =>
                apiClient.addStance(
                    form.Stand,
                    form.Reason,
                    form[`Issue SummaryID`],
                    form.PartyID,
                ),
            setResource: setStances,
            key: "StanceID",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });
    // Delete data
    const { handleDeleteSubmit, _deleteSubmitLoading, _deleteSubmitError } =
        useDeleteSubmitHandler({
            deleteFunction: (form) => apiClient.deleteStance(form.StanceID),
            setResource: setStances,
            key: "StanceID",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });

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
        }).catch((err) => {
            setIsLoading(false);
            setLatestError(err);
        });

        return () => {
            cancelled = true;
        };
    }, [apiClient]);

    const schema = [
        { name: "StanceID", type: "id", filterable: false },
        { name: "Stand", type: "boolean", filterable: true },
        { name: "Reason", type: "string", maxLen: 1000, filterable: false },
        {
            name: "Issue Summary",
            type: "dropdown",
            filterable: true,
            dropdownData: {
                key: "IssueID",
                value: "Summary",
                data: questions,
            },
        },
        {
            name: "Party",
            type: "dropdown",
            filterable: true,
            dropdownData: {
                key: "PartyID",
                value: "Name",
                data: parties,
            },
        },
    ];

    return (
        <Management_Layout
            title={<>Stance</>}
            data={stances}
            schema={schema}
            isLoading={isLoading}
            updateSubmitHandler={(form) => handleUpdateSubmit(form)}
            addSubmitHandler={(form) => handleAddSubmit(form)}
            deleteSubmitHandler={(form) => handleDeleteSubmit(form)}
            error={latestError}
        />
    );
};

export default Stance;
