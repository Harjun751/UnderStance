import { BrowserRouter, Routes, Route } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import "./App.css";

/* Page imports */
import LoginPage from "./components/auth/LoginPage";
import AuthWrapper from "./components/auth/AuthenticatedRouteWrapper";
import AuthLoadWrapper from "./components/auth/AuthLoadWrapper";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
    return (
        <Auth0Provider
            domain="dev-i0ksanu2a66behjf.us.auth0.com"
            clientId="epA5sJrx7Ja3wy7BK03v7nzlEASqTIzD"
            authorizationParams={{
                redirect_uri: `${window.location.origin}/home`,
                audience: "https://understance-backend.onrender.com/",
            }}
        >
            <AuthLoadWrapper>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route
                            path="/home"
                            element={
                                <AuthWrapper>
                                    <Dashboard />
                                </AuthWrapper>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </AuthLoadWrapper>
        </Auth0Provider>
    );
}

export default App;
