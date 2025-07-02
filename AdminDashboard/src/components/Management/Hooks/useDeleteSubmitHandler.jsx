import { useState } from "react";

export function useDeleteSubmitHandler({ deleteFunction, setResource, key, setError, setIsLoading }) {
    const handleDeleteSubmit = async (form) => {
        setIsLoading(true);

        try {
            const resp = await deleteFunction(form);
            // remove resource
            setResource((prevItems) =>
                prevItems.filter((item) => item[key] !== form[key]),
            );
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleDeleteSubmit };
}
