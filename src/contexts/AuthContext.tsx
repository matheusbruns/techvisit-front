import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tipo do contexto
interface AuthContextType {
    user: any;
    login: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}

// Provedor de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/techvisit/home");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/security/login");
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
