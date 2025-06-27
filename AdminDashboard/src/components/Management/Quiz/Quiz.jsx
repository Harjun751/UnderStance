import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
//import { MdQuiz  } from "react-icons/md";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            apiClient.getQuestions(),
            apiClient.getCategories()
        ]).then(([questions,categories]) => {
            if (!cancelled) {
                setQuestions(questions);
                setCategories(categories);
                setIsLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const schema = [
        { name: "IssueID", type: "id", filterable: false },
        { name: "Description", type: "string", maxLen: 300, filterable: false },
        { name: "Summary", type: "string", maxLen: 50, filterable: false },
        { name: "Category", type: "dropdown", filterable: true, dropdownData: { key: "CategoryID", value: "Name", data: categories } },
        { name: "Active", type: "boolean", filterable: true },
    ]

    return (
        <Management_Layout
            title={<> Question </>}
            data={questions}
            isLoading={isLoading}
            schema={schema}
        />
    );
};

export default Quiz;
