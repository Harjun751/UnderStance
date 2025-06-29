import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
import { useUpdateSubmitHandler } from "../Hooks/useUpdateSubmitHandler";
import { useAddSubmitHandler } from "../Hooks/useAddSubmitHandler";
import { useDeleteSubmitHandler } from "../Hooks/useDeleteSubmitHandler";

const Party = () => {
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    /*           HANDLER HOOKS
     * For updating/adding/submitting data
     * Passes anon functions to general component to call
     */
    // Update data
    const { handleUpdateSubmit, _updateSubmitLoading, _updateSubmitError } =
        useUpdateSubmitHandler({
            updateFunction: (form) => apiClient.updateParty(
                form.PartyID,
                form.Name,
                form.ShortName,
                form.Icon,
                form.PartyColor,
                form.Active
            ),
            setResource: setParties,
            key: "PartyID",
        });
    // Add data
    const { handleAddSubmit, _addSubmitLoading, _addSubmitError } =
        useAddSubmitHandler({
            addFunction: (form) => apiClient.addParty(
                form.Name,
                form.ShortName,
                form.Icon,
                form.PartyColor,
                form.Active
            ),
            setResource: setParties,
            key: "PartyID",
        });
    // Delete data
    const { handleDeleteSubmit, _deleteSubmitLoading, _deleteSubmitError } =
        useDeleteSubmitHandler({
            deleteFunction: (form) => apiClient.deleteParty(form.PartyID),
            setResource: setParties,
            key: "PartyID"
        });


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
    }, [apiClient]);



    const schema = [
        { name: "PartyID", type: "id", filterable: false },
        { name: "Name", type: "string", maxLen:100, filterable: false },
        { name: "ShortName", type: "string", maxLen:5, filterable: false },
        { name: "Icon", type: "image", maxLen:2083, filterable: false },
        { name: "PartyColor", type: "color", filterable: false },
        { name: "Active", type: "boolean", filterable: true },
    ];

    return (
        <Management_Layout
            title={<> Party </>}
            data={parties}
            schema={schema}
            isLoading={isLoading}
            updateSubmitHandler={(form) => 
                handleUpdateSubmit(form)
            }
            addSubmitHandler= { (form) => handleAddSubmit(form) }
            deleteSubmitHandler={ (form) => handleDeleteSubmit(form) }
        />
    );
};

export default Party;
