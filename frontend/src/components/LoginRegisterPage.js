import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../AuthContext'; // Importez le hook useAuth depuis votre contexte d'authentification


const LoginRegisterPage = () => {
    const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
    const [registerFormData, setRegisterFormData] = useState({ username: '', email: '', password: '' });
    const { setIsAuthenticated, isAuthenticated, updateAuthState } = useAuth(); // Utilisez le hook useAuth pour accéder à setIsAuthenticated et setIsAdmin
    const navigate = useNavigate(); // Initialise le hook useHistory

    useEffect(() => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
          navigate('/');
        }
      }, [isAuthenticated, navigate]);

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterFormData({ ...registerFormData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginFormData),
            });
            const data = await response.json();
            console.log(data); // Gère la réponse du serveur ici
            if (response.ok) {
                console.log(data);
                updateAuthState(true, data.admin, data.token); // Met à jour l'état de l'authentification et de l'administrateur
                navigate('/'); // Redirige vers la page d'accueil si la connexion réussit
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerFormData),
            });
            const data = await response.json();
            console.log(data); // Gère la réponse du serveur ici
            if (response.ok) {
                setIsAuthenticated(true); // Met à jour isAuthenticated à true
                navigate('/'); // Redirige vers la page d'accueil si la connexion réussit
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" align="center">Login</Typography>
                <form onSubmit={handleLoginSubmit}>
                    <TextField 
                        fullWidth
                        type="email"
                        label="Email"
                        name="email"
                        value={loginFormData.email}
                        onChange={handleLoginChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField 
                        fullWidth
                        type="password"
                        label="Password"
                        name="password"
                        value={loginFormData.password}
                        onChange={handleLoginChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>Login</Button>
                </form>
                <Typography variant="subtitle1" align="center" style={{ marginTop: '20px' }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </Typography>
            </Paper>

            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" align="center">Register</Typography>
                <form onSubmit={handleRegisterSubmit}>
                    <TextField 
                        fullWidth
                        type="text"
                        label="Username"
                        name="username"
                        value={registerFormData.username}
                        onChange={handleRegisterChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField 
                        fullWidth
                        type="email"
                        label="Email"
                        name="email"
                        value={registerFormData.email}
                        onChange={handleRegisterChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField 
                        fullWidth
                        type="password"
                        label="Password"
                        name="password"
                        value={registerFormData.password}
                        onChange={handleRegisterChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>Register</Button>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginRegisterPage;
