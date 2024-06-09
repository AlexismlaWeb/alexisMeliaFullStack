import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Avatar, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useAuth } from '../AuthContext';
import CreateRecipeModal from './CreateRecipeModal';
import Navbar from './Navbar';

const ProfilePage = () => {
    const { isAuthenticated, isAdmin, token} = useAuth();
    const navigate = useNavigate(); // Initialise le hook useHistory
    const [userRecipes, setUserRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [user, setUser] = useState({});


    useEffect(() => {
        const fetchRecipes = async () => {
            if (isAuthenticated) {
                try {
                        // Effectuez une requête GET vers l'endpoint approprié pour obtenir les informations du profil de l'utilisateur
                        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/user/profile`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                                }
                            });
                    
                            // Vérifiez si la requête a réussi
                            if (!response.ok) {
                                throw new Error('Error fetching user profile');
                            }
                    
                            // Convertissez la réponse en JSON
                            const userData = await response.json();
                            
                            // userData contient maintenant les informations du profil de l'utilisateur
                            setUser(userData);

                    // Récupérer les recettes créées par l'utilisateur
                    const userRecipesResponse = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes/myrecipes`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    const userRecipesData = await userRecipesResponse.json();
                    console.log('reccc',userRecipesResponse);
                    setUserRecipes(userRecipesData);

                    // Récupérer les recettes enregistrées par l'utilisateur
                    const savedRecipesResponse = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes/savedrecipes`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    setSavedRecipes(savedRecipesResponse.data);
                } catch (error) {
                    console.error("There was an error fetching the recipes!", error);
                }
            }else {
                navigate('/login');
            }
        };
        fetchRecipes();
    }, [isAuthenticated, token, navigate]);

    return (
        <div>
            <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                        <Avatar
                            alt={user.username}
                            src={user.profilePicture}
                            sx={{ width: 150, height: 150, margin: 'auto' }}
                            />
                        <Typography variant="h6" style={{ marginTop: '20px' }}>{user.username}</Typography>
                        <Typography variant="body1">{user.email}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" style={{ marginBottom: '20px' }}>Menu</Typography>
                        <List>
                            <ListItem button onClick={() => setOpenModal(true)}>
                                <ListItemText primary="Créer une recette" />
                                <CreateRecipeModal open={openModal} handleClose={() => setOpenModal(false)} />
                            </ListItem>
                            <ListItem button component={Link} to="/liked-posts">
                                <ListItemText primary="Posts likés" />
                            </ListItem>
                            <ListItem button component={Link} to="/saved-posts">
                                <ListItemText primary="Posts enregistrés" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        </div>      
    );
};

export default ProfilePage;
