import Management_Layout from "../Management_Layout";
//import { FaFlag } from "react-icons/fa";

const Party = () => {
    //Dummy data
    const parties = [
        { id: 1, description: "lmao" },
        { id: 2, description: "dingle" },
        { id: 3, description: "finglebop" },
        { id: 4, description: "japanese" },
    ];

    const tempSchema = [
        { name: "id", type: "id", filterable: false },
        { name: "description", type: "string", filterable: false },
    ];

    return (
        // <Management_Layout title={<><FaFlag /> Party </>} data={parties}>
        <Management_Layout title={<> Party </>} data={parties} schema={tempSchema} />
    );
};

export default Party;
