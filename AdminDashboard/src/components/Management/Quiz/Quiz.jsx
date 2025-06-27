import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
//import { MdQuiz  } from "react-icons/md";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    useEffect(() => {
        // ignore var to prevent race condition
        let ignoreQn = false;
        let ignoreCat = false;

        apiClient.getQuestions().then(result => {
            if (!ignoreQn) {
                setQuestions(result);
                setQuestionsLoading(false);
                setIsLoading((false || categoriesLoading));
            }
        });

        apiClient.getCategories().then(result => {
            if (!ignoreCat) {
                setCategories(result);
                setCategoriesLoading(false);
                setIsLoading((false || questionsLoading));
            }
        });

        return () => {
           ignoreCat = true; 
           ignoreQn = true; 
        };
    }, [questionsLoading, categoriesLoading]);

    const schema = [
        { name: "IssueID", type: "id", filterable: false },
        { name: "Description", type: "string", maxLen: 300, filterable: false },
        { name: "Summary", type: "string", maxLen: 80, filterable: false },
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
