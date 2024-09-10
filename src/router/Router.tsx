import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { AuthProvider } from "../contexts/AuthContext";
import { PublicRoute } from "./components/PublicRoute";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "../pages/home/Home";
import Customer from "../pages/customer/Customer";
import { Organization } from "../pages/organization/Organization";

function Router() {

    return <>
        <AuthProvider>
            <Routes>
                <Route path="/security/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/techvisit/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/techvisit/customer" element={<PrivateRoute><Customer /></PrivateRoute>} />
                <Route path="/techvisit/technician" element={<PrivateRoute><h1>technician</h1></PrivateRoute>} />
                <Route path="/techvisit/organization" element={<PrivateRoute><Organization /></PrivateRoute>} />
                <Route path="/techvisit/users" element={<PrivateRoute><h1>users</h1></PrivateRoute>} />
                <Route path="/not-authorized" element={<h1>VOCE NAO TEM ACESSO A ESSA TELA</h1>} />
            </Routes>
        </AuthProvider>
    </>
}

export default Router;