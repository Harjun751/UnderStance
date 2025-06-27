import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    // Fetch Data
    useEffect(() => {
        let ignore = false;

        apiClient.getCategories().then(result => {
            if (!ignore) {
                setCategories(result);
                setIsLoading(false);
            }
        });

        return () => {
            ignore = true;
        }
    }, []);

    const schema = [
        { name: "CategoryID", type: "id", filterable: false },
        { name: "Name", type: "string", maxLen:50, filterable: false },
    ];
    return (
        <Management_Layout
            title={<> Category </>}
            data={categories}
            schema={schema}
            isLoading={isLoading}
        />
    );
};

export default Category;
