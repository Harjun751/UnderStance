import { useState } from "react";

export function useUpdateSubmitHandler({ updateFunction, setResource, key, setError, setIsLoading }) {
    const handleUpdateSubmit = async (form) => {
        setIsLoading(true);

        try {
            console.log(form);
            const resp = await updateFunction(form);
            setResource((prevItems) =>
                prevItems.map((obj) =>
                    obj[key] === resp.data[key] ? form : obj,
                ),
            );
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleUpdateSubmit };
}
