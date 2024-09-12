import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {

    const { setUser, setToken } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        }

        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user))
        }

    }, []);

    const token = localStorage.getItem("token");
    const isLogged = !!token;

    if (isLogged) {
        return <Navigate to="/techvisit/home" />;
    }

    return children;
};