import Management_Layout from "../Management_Layout";
//import { BiSolidCategoryAlt } from "react-icons/bi";

const Category = () => {
    // Fetch Data
    // Pass data through to Management Layout.

    //Dummy data
    const categories = [
        { id: 1, category: "term"},
        { id: 2, category: "people"},
    ];
    return (
        // <Management_Layout title={<><BiSolidCategoryAlt /> Category </>} data={categories}>
        <Management_Layout title={<> Category </>} data={categories} />
    )
}

export default Category;