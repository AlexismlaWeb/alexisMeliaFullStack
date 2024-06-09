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

    const [token, setToken] = useState(() => {
        // Récupère le token depuis localStorage
        return localStorage.getItem('token');
    }
    );

    // Fonction pour mettre à jour l'état de l'authentification
    const updateAuthState = (authenticated, admin, authToken) => {
        setIsAuthenticated(authenticated);
        setIsAdmin(admin);
        setToken(authToken);
        if (!authenticated) {
            localStorage.removeItem('token');
        }else {
            localStorage.setItem('token', authToken);
        }
        // Stocke l'état de l'authentification dans localStorage
        localStorage.setItem('isAuthenticated', authenticated);
        localStorage.setItem('isAdmin', admin);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, updateAuthState, token }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
