// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginRegisterPage from './components/LoginRegisterPage';
import HomePage from './components/Home';
import { AuthProvider } from './AuthContext'; // Importe le fournisseur de contexte d'authentification

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider> {/* Enveloppe toute ton application avec le fournisseur de contexte */}
                <Routes>
                    <Route path="/login" element={<LoginRegisterPage />} />
                    <Route path="/" element={<HomePage />} />
                    {/* <ProtectedRoute path="/profile" element={<ProfilePage />} /> */}
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
