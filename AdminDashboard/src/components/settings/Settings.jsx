import "./Settings.css";
import Layout from "../general/Layout";
import Loader from "../general/Loader";
import ErrorModal from "../general/ErrorModal";
import { useAPIClient } from "../api/useAPIClient";
import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useId } from 'react';


const Settings = () => {
    const apiClient = useAPIClient();
    const { user } = useAuth0();
    const [error, setError] = useState(null);
    const [isLoading, _setIsLoading] = useState(false);
    const [name, setName] = useState(user.name);
    const [picture, setPicture] = useState(user.picture);
    let defaultTheme = localStorage.getItem('data-theme');
    defaultTheme = (defaultTheme === "light" || defaultTheme === "dark") ? defaultTheme : "light";
    const [theme, setTheme] = useState(defaultTheme);
    const [submitting, setSubmitting] = useState(false);

    // Form element IDs
    const themeDarkId = useId();
    const themeLightId = useId();

    const themeHandler = (theme) => {
        setTheme(theme);
        if (theme === "light") {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('data-theme', 'light');
        } else if (theme === "dark") {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('data-theme', 'dark');
        }
    };

    const updateUserHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData(e.target);
            await apiClient.updateUserNoRole(user.sub, formData.get("name"), formData.get("picture"));
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
            window.location.reload();
        }
    }

    return (
        <Layout
            title={
                <>
                    Settings
                </>
            }
        >
            {isLoading && (
                <Loader message="Loading data..."/>
            )}
            <ErrorModal error={error}/>
            <div className="settings-section profile">
                <h1>Profile</h1>
                <form onSubmit={e => updateUserHandler(e)}>
                    <div className="row">
                        <div className="col">
                            <label>
                                Display Name
                                <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
                            </label>
                            <label>
                                Picture
                                <input type="text" name="picture" value={picture} onChange={e => setPicture(e.target.value)} />
                            </label>
                            <button type="submit" disabled={submitting} className={submitting ? "disabled" : ""}>
                                {submitting ? "Submitting..." : "Save User Info"}
                            </button>
                        </div>
                        <div className="img-container">
                            <h3>Profile picture preview</h3>
                            <img src={picture} alt="Profile Preview" />
                        </div>
                    </div>
                </form>
            </div>

            <div className="settings-section appearance">
                <h1>Appearance</h1>
                <div className="theme-selector">
                    <h3>Theme</h3>
                    <div className="radio-container">
                        <h3>Light Theme</h3>
                        <input
                            className="radio" type="radio"
                            name="theme" value="light" id={themeLightId}
                            onChange={e => themeHandler(e.target.value)}
                            checked={theme === 'light'}
                        />
                        <label className="preview light-option" htmlFor={themeLightId}>Light Theme</label>
                    </div>
                    <div className="radio-container">
                        <h3>Dark Theme</h3>
                        <input 
                            className="radio"
                            type="radio" name="theme"
                            value="dark" id={themeDarkId}
                            onChange={e => themeHandler(e.target.value)}
                            checked={theme === 'dark'}
                        />
                        <label className="preview dark-option" htmlFor={themeDarkId}>Dark Theme</label>
                    </div>
                </div>
            </div>
            <div className="settings-section">
                <h1>Other Links</h1>
                <div className="row">
                    <div>
                        <h3>Auth0 Dashboard</h3>
                        <a href="https://manage.auth0.com/dashboard/us/dev-i0ksanu2a66behjf/">
                            <button type="submit">Auth0 Dashboard</button>
                        </a>
                    </div>
                    {/*<div>
                        <label>Change Password</label>
                        <a href={changePasswordURL}>
                            <button type="button">Change Password</button>
                        </a>
                    </div>*/}
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
