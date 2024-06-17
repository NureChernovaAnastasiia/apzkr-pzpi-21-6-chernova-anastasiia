import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./main";
import { check } from "./http/userAPI";
import './components/i18n';

const App = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        check().then(data => {
            user.setUser(true);
            user.setIsAuth(true);
        }).finally(() => setLoading(false));
    }, [user]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <BrowserRouter>
            <NavBar toggleMenu={toggleMenu} />
            <div className="app-container">
                <div className="main-content" style={mainContentStyle(isMenuOpen)}>
                    <AppRouter />
                </div>
            </div>
        </BrowserRouter>
    );
});

const mainContentStyle = (isMenuOpen) => ({
    marginLeft: isMenuOpen ? "250px" : "0",
    padding: "20px",
    width: isMenuOpen ? "calc(100% - 250px)" : "100%",
    transition: "margin-left 0.3s"
});

export default App;
