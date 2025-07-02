import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
import { useUpdateSubmitHandler } from "../Hooks/useUpdateSubmitHandler";
import { useAddSubmitHandler } from "../Hooks/useAddSubmitHandler";
import { useDeleteSubmitHandler } from "../Hooks/useDeleteSubmitHandler";

const Category = () => {
    // States for loading and data
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [latestError, setLatestError] = useState(null);

    /*           HANDLER HOOKS
     * For updating/adding/submitting data
     * Passes anon functions to general component to call
     */
    // Update data
    const { handleUpdateSubmit } =
        useUpdateSubmitHandler({
            updateFunction: (form) =>
                apiClient.updateCategory(form.CategoryID, form.Name),
            setResource: setCategories,
            key: "CategoryID",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });
    // Add data
    const { handleAddSubmit } =
        useAddSubmitHandler({
            addFunction: (form) => apiClient.addCategory(form.Name),
            setResource: setCategories,
            key: "CategoryID",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });
    // Delete data
    const { handleDeleteSubmit } =
        useDeleteSubmitHandler({
            deleteFunction: (form) => apiClient.deleteCategory(form.CategoryID),
            setResource: setCategories,
            key: "CategoryID",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });

    // API Client for requests
    const apiClient = useAPIClient();

    // Fetch the category data and populate
    useEffect(() => {
        let ignore = false;

        apiClient.getCategories().then((result) => {
            if (!ignore) {
                setCategories(result);
                setIsLoading(false);
            }
        }).catch((err) => {
            setIsLoading(false);
            setLatestError(err);
        });

        return () => {
            ignore = true;
        };
    }, [apiClient]);

    const schema = [
        { name: "CategoryID", type: "id", filterable: false },
        { name: "Name", type: "string", maxLen: 50, filterable: false },
    ];
    return (
        <Management_Layout
            title={<> Category </>}
            data={categories}
            schema={schema}
            isLoading={isLoading}
            updateSubmitHandler={(form) => handleUpdateSubmit(form)}
            addSubmitHandler={(form) => handleAddSubmit(form)}
            deleteSubmitHandler={(form) => handleDeleteSubmit(form)}
            error={latestError}
        />
    );
};

export default Category;
