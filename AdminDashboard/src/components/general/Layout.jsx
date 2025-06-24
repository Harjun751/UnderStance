import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import TopBar from "../dashboard/TopBar";

const Layout = ({ children, title }) => {
    return (
        <div className="container">
            <Navbar />
            <div className="page-container">
                <Header Title={title} />
                <div className="page-container-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;