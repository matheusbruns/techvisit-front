import { Route, Routes, useLocation } from "react-router-dom";
import { Login } from "../pages/login/Login";
import { AuthProvider } from "../contexts/AuthContext";
import { PublicRoute } from "./components/PublicRoute";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "../pages/home/Home";
import Customer from "../pages/customer/Customer";
import { Organization } from "../pages/organization/Organization";
import { Users } from "../pages/users/Users";
import Header from "../util/components/header/Header";
import NotFound from "../pages/notFound/NotFound";

function Router() {
    const location = useLocation();

    const shouldShowHeader = location.pathname !== '/';

    return <>
        <AuthProvider>
            {shouldShowHeader && (<Header />)}
            <Routes>
                <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/techvisit/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/techvisit/customer" element={<PrivateRoute><Customer /></PrivateRoute>} />
                <Route path="/techvisit/technician" element={<PrivateRoute><h1>technician</h1></PrivateRoute>} />

                <Route path="/admin/organization" element={<PrivateRoute><Organization /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                
                <Route path="*" element={
                    <NotFound statusCode="404"
                        primaryMessage="Oops! Página não encontrada."
                        secondaryMessage="A página que você está procurando não existe ou foi movida."
                    />
                }
                />
                <Route path="/not-authorized" element={
                    <NotFound statusCode="403"
                        primaryMessage="Acesso Negado"
                        secondaryMessage="Você não tem permissão para acessar esta página." />
                }
                />

            </Routes>
        </AuthProvider>
    </>
}

export default Router;