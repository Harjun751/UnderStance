/*                          AuthLoadWrapper
 * Wrapper to insert loading/error elements for the auth0 SDK */
import Loader from "../general/Loader";
import { useAuth0 } from "@auth0/auth0-react";
function Wrapper({ children }) {
    const { isLoading, error } = useAuth0();
    if (isLoading) {
        return <Loader message="Initializing app..." style={{ marginTop: '100px' }}/>
    }
    if (error) {
        console.error(error);
        return <div>Oops... Error</div>;
    }
    return <>{children}</>;
}
export default Wrapper;
