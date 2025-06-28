import { useState, useEffect } from 'react';

export function useAddSubmitHandler({ addFunction, setResource, key }) {
    const [addSubmitLoading, setAddSubmitLoading] = useState(false);
    const [addSubmitError, setAddSubmitError] = useState(null);

    const handleAddSubmit = async (form) => {
        setAddSubmitLoading(true);

        try {
            const resp = await addFunction(form);
            // create new object based on form and returned value
            const newObject = {}
            Object.entries(form).forEach(([field, value]) => {
                newObject[field] = value;
            });
            newObject[key] = resp.data[key];
            // set new object
            setResource(prevItems => [...prevItems, newObject]);
        } catch (err) {
            // Alert with details given from backend
            if (err.response?.data?.error) {
                const info = err.response.data;
                if (info.details) {
                    alert(`${info.error} \n${info.details}`)
                } else {
                    alert(`${info.error}`)
                }
            } else {
                // Other error: just alert with code
                alert(`${err}`);
            }
            setAddSubmitError(err);
        } finally {
            setAddSubmitLoading(false);
        }
    };

    return { handleAddSubmit, addSubmitLoading, addSubmitError };
};
