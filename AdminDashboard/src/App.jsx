import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/* Page imports */
import LoginPage from "./components/auth/LoginPage";
import AuthWrapper from "./components/auth/AuthenticatedRouteWrapper";
import AuthLoadWrapper from "./components/auth/AuthLoadWrapper";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
    const [count, setCount] = useState(0);

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
