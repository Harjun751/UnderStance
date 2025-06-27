import Management_Layout from "../Management_Layout";
//import { GiInjustice } from "react-icons/gi";

const Stance = () => {
    const stances = [
        { id: 1, stand: true, Reason: "funny", IssueId: 1, partyId: 1 },
        { id: 2, stand: false, Reason: "best", IssueId: 1, partyId: 2 },
        { id: 3, stand: true, Reason: "best", IssueId: 2, partyId: 1 },
        { id: 4, stand: false, Reason: "worst", IssueId: 2, partyId: 2 },
        { id: 1, stand: true, Reason: "funny", IssueId: 3, partyId: 1 },
        { id: 2, stand: false, Reason: "best", IssueId: 3, partyId: 2 },
        { id: 3, stand: true, Reason: "best", IssueId: 4, partyId: 1 },
        { id: 4, stand: false, Reason: "worst", IssueId: 4, partyId: 2 },
    ];

    const tempSchema = [
        { name: "id", type: "id", filterable: false },
        { name: "stand", type: "boolean", filterable: true },
        { name: "Reason", type: "string", maxLen: 300, filterable: false },
        { name: "IssueId", type: "integer", filterable: true },
        { name: "partyId", type: "integer", filterable: true },
    ];
    return (
        // <Management_Layout title={<><GiInjustice /> Stance</>} data={stances}>
        <Management_Layout title={<>Stance</>} data={stances} schema={tempSchema} />
    );
};

export default Stance;
