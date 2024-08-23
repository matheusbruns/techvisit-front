import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { AuthProvider } from "../contexts/AuthContext";
import { PublicRoute } from "./components/PublicRoute";
import { PrivateRoute } from "./components/PrivateRoute";
import { Home } from "../pages/home/Home";
import Customer from "../pages/customer/Customer";

function Router() {

    return <>
        <AuthProvider>
            <Routes>
                <Route path="/security/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/techvisit/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/techvisit/Customer" element={<PrivateRoute><Customer/></PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><h1>ERROR 404 - PAGE NOT FOUND</h1></PrivateRoute>} />
            </Routes>
        </AuthProvider>
    </>
}

export default Router;