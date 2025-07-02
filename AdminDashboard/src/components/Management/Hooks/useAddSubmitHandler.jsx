import { useState } from "react";

export function useAddSubmitHandler({ addFunction, setResource, key, setError, setIsLoading }) {
    const handleAddSubmit = async (form) => {
        setIsLoading(true);

        try {
            const resp = await addFunction(form);
            // create new object based on form and returned value
            const newObject = {};
            Object.entries(form).forEach(([field, value]) => {
                newObject[field] = value;
            });
            newObject[key] = resp.data[key];
            // set new object
            setResource((prevItems) => [...prevItems, newObject]);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleAddSubmit };
}
