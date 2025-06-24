import { BrowserRouter, Routes, Route } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import "./App.css";

/* Page imports */
import LoginPage from "./components/auth/LoginPage";
import AuthWrapper from "./components/auth/AuthenticatedRouteWrapper";
import AuthLoadWrapper from "./components/auth/AuthLoadWrapper";
import Dashboard from "./components/dashboard/Dashboard";
import Category from "./components/Management/Category/Category";
import Quiz from "./components/Management/Quiz/Quiz";
import Stance from "./components/Management/Stance/Stance";
import Party from "./components/Management/Party/Party";

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
                        <Route
                            path="/category"
                            element={
                                <AuthWrapper>
                                    <Category />
                                </AuthWrapper>
                            }
                        />
                        <Route
                            path="/quiz"
                            element={
                                <AuthWrapper>
                                    <Quiz />
                                </AuthWrapper>
                            }
                        />
                        <Route
                            path="/stance"
                            element={
                                <AuthWrapper>
                                    <Stance />
                                </AuthWrapper>
                            }
                        />
                        <Route
                            path="/party"
                            element={
                                <AuthWrapper>
                                    <Party />
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
