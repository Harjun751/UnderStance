import { useState } from "react";

export function useUpdateSubmitHandler({ updateFunction, setResource, key, setError, setIsLoading }) {
    const handleUpdateSubmit = async (form) => {
        setIsLoading(true);
        try {
            const resp = await updateFunction(form);
            setResource((prevItems) => {
                    return prevItems.map((obj) => {
                        if (obj[key] === resp.data[key]) {
                            // copy fields from obj and overwrite
                            Object.assign(obj, form);
                            return obj;
                        } else {
                            return obj;
                        }
                    });
                }
            );
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleUpdateSubmit };
}
