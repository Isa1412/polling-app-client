import React, {useCallback, useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Layout, notification} from "antd";
import './styles/App.css';
import 'antd/dist/antd.min.css';
import PollService from "./API/PollService";
import Navbar from "./components/UI/navbar/Navbar";
import Loader from "./components/UI/loader/Loader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PollList from "./pages/PollList";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import NewPoll from "./pages/NewPoll";
import {ACCESS_TOKEN} from "./constants/Constants";
import PrivateRoute from "./components/PrivateRoute";

const {Content} = Layout;

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    notification.config({
        placement: 'topRight',
        top: 70,
        duration: 3
    });

    const loadCurrentUser = useCallback(() => {
        PollService.getCurrentUser()
            .then(response => {
                setCurrentUser(response);
                setIsAuthenticated(true);
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
        })
    }, []);

    const handleLogin = () => {
        notification.success({
            message: 'Polling App',
            description: "You're successfully logged in."
        })
        loadCurrentUser();
        navigate("/");
    }

    const handleLogout = (redirectTo="/",
                          notificationType="success",
                          description="You're successfully logged out.") => {

        localStorage.removeItem(ACCESS_TOKEN);

        setCurrentUser(null);
        setIsAuthenticated(false);

        navigate(redirectTo);

        notification[notificationType]({
            message: 'Polling App',
            description: description,
        });
    }

    useEffect(() => {
        loadCurrentUser();
    }, [loadCurrentUser]);

    if (isLoading) {
        return <Loader/>;
    }

    return (
        <Layout className="app-container">
            <Navbar
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                onLogout={handleLogout}
            />

            <Content className="app-content">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<PollList isAuthenticated={isAuthenticated} onLogout={handleLogout}/>}/>
                        <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/users/:username" element={<Profile/>}/>
                        <Route
                            path="/poll/new"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated}>
                                    <NewPoll onLogout={handleLogout}/>
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Content>
        </Layout>
    );
}

export default App;
