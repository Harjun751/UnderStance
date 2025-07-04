import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
import { useUpdateSubmitHandler } from "../Hooks/useUpdateSubmitHandler";
import { useAddSubmitHandler } from "../Hooks/useAddSubmitHandler";
import { useDeleteSubmitHandler } from "../Hooks/useDeleteSubmitHandler";

const User = () => {
    // States for loading and data
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [latestError, setLatestError] = useState(null);

    /*           HANDLER HOOKS
     * For updating/adding/submitting data
     * Passes anon functions to general component to call
     */
    // Update data
    const { handleUpdateSubmit } =
        useUpdateSubmitHandler({
            updateFunction: (form) => apiClient.updateUser(form.user_id, form.name, form.picture, form.rolesID),
            setResource: setUsers,
            key: "user_id",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });
    // Add data
    const { handleAddSubmit } =
        useAddSubmitHandler({
            addFunction: (form) => apiClient.addUser(form.name, form.picture, form.email, form.rolesID),
            setResource: setUsers,
            key: "user_id",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });
    // Delete data
    const { handleDeleteSubmit } =
        useDeleteSubmitHandler({
            deleteFunction: (form) => apiClient.deleteUser(form.user_id),
            setResource: setUsers,
            key: "user_id",
            setError: setLatestError,
            setIsLoading: setIsLoading,
        });

    // API Client for requests
    const apiClient = useAPIClient();

    // Fetch the User data and populate
    useEffect(() => {
        let ignore = false;

        Promise.all([
            apiClient.getUsers(),
            apiClient.getRoles()
        ]).then(([users, roles]) => {
            if (!ignore);
            setUsers(users);
            setRoles(roles);
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
            setLatestError(err);
        });

        return () => {
            ignore = true;
        };
    }, [apiClient]);

    const schema = [
        { name: "picture", type: "image", filterable: false },
        { name: "name", type: "string", filterable: false },
        { name: "email", type: "string", filterable: false, noupdate: true },
        { name: "user_id", type: "id", filterable: false },
        {
            name: "roles",
            type: "dropdown",
            filterable: true,
            dropdownData: {
                key: "id",
                value: "name",
                data: roles
            },
        },
    ];

    return (
        <Management_Layout
            title={<> User </>}
            data={users}
            dataKey="user_id"
            schema={schema}
            isLoading={isLoading}
            updateSubmitHandler={(form) => handleUpdateSubmit(form)}
            addSubmitHandler={(form) => handleAddSubmit(form)}
            deleteSubmitHandler={(form) => handleDeleteSubmit(form)}
            error={latestError}
        />
    );
};

export default User;
