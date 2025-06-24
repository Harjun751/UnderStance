import Navbar from "../Navbar/Navbar";
import TopBar from "../dashboard/TopBar";

const Layout = ({ children }) => {
    return (
        <div className="container">
            <Navbar />
            <div className="page-container">
                <TopBar />
                {children}
            </div>
        </div>
    );
};

export default Layout;