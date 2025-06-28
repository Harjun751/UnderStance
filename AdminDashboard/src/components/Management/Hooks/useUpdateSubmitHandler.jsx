import { useState, useEffect } from 'react';

export function useUpdateSubmitHandler({ updateFunction, setResource, key}) {
    const [updateSubmitLoading, setUpdateSubmitLoading] = useState(false);
    const [updateSubmitError, setUpdateSubmitError] = useState(null);

    const handleUpdateSubmit = async (form) => {
        setUpdateSubmitLoading(true);

        try {
            console.log(form);
            const resp = await updateFunction(form);
            setResource(prevItems => 
                prevItems.map(obj => 
                    obj[key] === resp.data[key]
                    ? form
                    : obj
                )
            );
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
            setUpdateSubmitError(err);
        } finally {
            setUpdateSubmitLoading(false);
        }
    };

    return { handleUpdateSubmit, updateSubmitLoading, updateSubmitError };
}
