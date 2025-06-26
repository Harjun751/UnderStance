import Management_Layout from "../Management_Layout";
//import { MdQuiz  } from "react-icons/md";

const Quiz = () => {
    const questions = [
        { id: 1, description: "lmao", summary: "funny", category: "term" },
        { id: 2, description: "dingle", summary: "wingle", category: "term" },
        {
            id: 3,
            description: "finglebop",
            summary: "dinglesingle",
            category: "people",
        },
        {
            id: 4,
            description: "test",
            summary: "worst",
            category: "term",
        },
    ];
    return (
        // <Management_Layout title={<><MdQuiz /> Question </>} data={questions}>
        <Management_Layout title={<> Question </>} data={questions} />
    );
};

export default Quiz;
