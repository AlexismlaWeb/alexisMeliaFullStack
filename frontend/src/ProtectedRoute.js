import React from 'react';
import { Navigate, Route } from 'react-router-dom';

// Composant de garde pour les pages protégées
const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
    return isAuthenticated ? <Route {...rest} element={element} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
