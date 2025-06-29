import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
import { useUpdateSubmitHandler } from "../Hooks/useUpdateSubmitHandler";
import { useAddSubmitHandler } from "../Hooks/useAddSubmitHandler";
import { useDeleteSubmitHandler } from "../Hooks/useDeleteSubmitHandler";
//import { MdQuiz  } from "react-icons/md";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    /*           HANDLER HOOKS
     * For updating/adding/submitting data
     * Passes anon functions to general component to call
     */
    // Update data
    const { handleUpdateSubmit, _updateSubmitLoading, _updateSubmitError } =
        useUpdateSubmitHandler({
            updateFunction: (form) =>
                apiClient.updateQuestion(
                    form.IssueID,
                    form.Description,
                    form.Summary,
                    form.CategoryID,
                    form.Active,
                ),
            setResource: setQuestions,
            key: "IssueID",
        });
    // Add data
    const { handleAddSubmit, _addSubmitLoading, _addSubmitError } =
        useAddSubmitHandler({
            addFunction: (form) =>
                apiClient.addQuestion(
                    form.Description,
                    form.Summary,
                    form.CategoryID,
                    form.Active,
                ),
            setResource: setQuestions,
            key: "IssueID",
        });
    // Delete data
    const { handleDeleteSubmit, _deleteSubmitLoading, _deleteSubmitError } =
        useDeleteSubmitHandler({
            deleteFunction: (form) => apiClient.deleteQuestion(form.IssueID),
            setResource: setQuestions,
            key: "IssueID",
        });

    useEffect(() => {
        let cancelled = false;

        Promise.all([apiClient.getQuestions(), apiClient.getCategories()]).then(
            ([questions, categories]) => {
                if (!cancelled) {
                    setQuestions(questions);
                    setCategories(categories);
                    setIsLoading(false);
                }
            },
        );
        return () => {
            cancelled = true;
        };
    }, [apiClient]);

    const schema = [
        { name: "IssueID", type: "id", filterable: false },
        { name: "Description", type: "string", maxLen: 300, filterable: false },
        { name: "Summary", type: "string", maxLen: 50, filterable: false },
        {
            name: "Category",
            type: "dropdown",
            filterable: true,
            dropdownData: {
                key: "CategoryID",
                value: "Name",
                data: categories,
            },
        },
        { name: "Active", type: "boolean", filterable: true },
    ];

    return (
        <Management_Layout
            title={<> Question </>}
            data={questions}
            isLoading={isLoading}
            schema={schema}
            updateSubmitHandler={(form) => handleUpdateSubmit(form)}
            addSubmitHandler={(form) => handleAddSubmit(form)}
            deleteSubmitHandler={(form) => handleDeleteSubmit(form)}
        />
    );
};

export default Quiz;
