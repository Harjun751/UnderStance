import Management_Layout from "../Management_Layout";

const Stance = () => {
    const stances = [
        { id: 1, stand: true, Reason: "funny", IssueId: 1, partyId: 1},
        { id: 2, stand: false, Reason: "best", IssueId: 1, partyId: 2},
        { id: 3, stand: true, Reason: "best", IssueId: 2, partyId: 1},
        { id: 4, stand: false, Reason: "worst", IssueId: 2, partyId: 2},
    ];
    return (
        <Management_Layout title={"Stance"} data={stances}>
            Test
        </Management_Layout>
    )
}

export default Stance;