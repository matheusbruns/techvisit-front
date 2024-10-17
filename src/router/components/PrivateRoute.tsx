import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { setUser, setToken } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        }

        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, [setToken, setUser]);

    const token = localStorage.getItem("token");
    const islogged = !!token;

    const userJson = localStorage.getItem("user") || '{}';
    const user: any = JSON.parse(userJson);
    const isAdmin = user.role === "ADMIN";
    const isTechnician = user.role === "TECHNICIAN";

    const childPath = window.location.pathname;
    const isAdminAndAdminRoutes = isAdmin && ADMIN_ROUTES.includes(childPath);
    const isTechnicianRoute = TECHNICIAN_ROUTES.includes(childPath);

    if (!islogged) {
        return <Navigate to="/" />;
    }

    if (isAdminAndAdminRoutes) {
        return children;
    }

    if (isTechnician && !isTechnicianRoute) {
        return <Navigate to="/techvisit/my-visits" />;
    }

    if (!isAdmin && ADMIN_ROUTES.includes(childPath)) {
        return <Navigate to="/not-authorized" />;
    }

    return children;
};

const ADMIN_ROUTES = ["/admin/organization", "/admin/users"];
const TECHNICIAN_ROUTES = ["/techvisit/my-visits"];