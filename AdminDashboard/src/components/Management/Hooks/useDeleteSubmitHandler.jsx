import { useState } from "react";

export function useDeleteSubmitHandler({
    /*deleteFunction,*/ setResource,
    key,
}) {
    const [deleteSubmitLoading, setDeleteSubmitLoading] = useState(false);
    const [deleteSubmitError, setDeleteSubmitError] = useState(null);

    const handleDeleteSubmit = async (form) => {
        setDeleteSubmitLoading(true);

        try {
            // const resp = await deleteFunction(form);
            // remove resource
            setResource((prevItems) =>
                prevItems.filter((item) => item[key] !== form[key]),
            );
        } catch (err) {
            // Alert with details given from backend
            if (err.response?.data?.error) {
                const info = err.response.data;
                if (info.details) {
                    alert(`${info.error} \n${info.details}`);
                } else {
                    alert(`${info.error}`);
                }
            } else {
                // Other error: just alert with code
                alert(`${err}`);
            }
            setDeleteSubmitError(err);
        } finally {
            setDeleteSubmitLoading(false);
        }
    };

    return { handleDeleteSubmit, deleteSubmitLoading, deleteSubmitError };
}
