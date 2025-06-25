import Management_Layout from "../Management_Layout";
//import { FaFlag } from "react-icons/fa";

const Party = () => {
    //Dummy data
    const parties = [
        { id: 1, description: "lmao"},
        { id: 2, description: "bussy"},
        { id: 3, description: "femboys"},
        { id: 4, description: "japanese"},
    ];

    return (
        // <Management_Layout title={<><FaFlag /> Party </>} data={parties}>
        <Management_Layout title={<> Party </>} data={parties} />
    )
}

export default Party;