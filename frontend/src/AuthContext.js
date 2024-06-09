// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Récupère l'état de l'authentification depuis localStorage
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [isAdmin, setIsAdmin] = useState(() => {
        // Récupère l'état de l'administrateur depuis localStorage
        return localStorage.getItem('isAdmin') === 'true';
    });

    // Fonction pour mettre à jour l'état de l'authentification
    const updateAuthState = (authenticated, admin) => {
        setIsAuthenticated(authenticated);
        setIsAdmin(admin);
        // Stocke l'état de l'authentification dans localStorage
        localStorage.setItem('isAuthenticated', authenticated);
        localStorage.setItem('isAdmin', admin);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, updateAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
