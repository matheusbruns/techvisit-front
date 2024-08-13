import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { PublicRoute } from "./components/PublicRoute";
import { PrivateRoute } from "./components/PrivateRoute";

function Router() {

    return <>
        <AuthProvider>
            <Routes>
                <Route path="/security/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/home" element={<PrivateRoute><h1 style={{ color: "#5b0081" }} >Home</h1></PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><h1>ERROR 404 - PAGE NOT FOUND</h1></PrivateRoute>} />
            </Routes>
        </AuthProvider>
    </>
}

export default Router;