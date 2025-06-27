import Management_Layout from "../Management_Layout";
import { useState, useEffect } from "react";
import { useAPIClient } from "../../api/useAPIClient";
//import { MdQuiz  } from "react-icons/md";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiClient = useAPIClient();

    useEffect(() => {
        // ignore var to prevent race condition
        let ignore = false;
        apiClient.getQuestions().then(result => {
            if (!ignore) {
                setQuestions(result);
                setIsLoading(false);
            }
        });
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <Management_Layout title={<> Question </>} data={questions} isLoading={isLoading} />
    );
};

export default Quiz;
