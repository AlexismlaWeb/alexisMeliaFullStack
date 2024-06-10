import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import RecipeCard from './RecipeCard';
import FullRecipeModal from './FullRecipe'; // Importer le composant modal pour afficher la recette complète
import { useAuth } from '../AuthContext';
import { Button, TextField, CircularProgress } from '@mui/material';

const Home = () => {
    const { isAuthenticated, isAdmin, token } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // État pour stocker la recette sélectionnée
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture et la fermeture du modal

    useEffect(() => {
        fetchRecipes();
    }, [page, filter]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes?page=${page}&limit=10&filter=${filter}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            const data = await response.json();
            if (page === 1) {
                setRecipes(data.recipes);
            } else {
                setRecipes(prevRecipes => [...prevRecipes, ...data.recipes]);
            }
            setHasMore(data.recipes.length === 10);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreRecipes = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPage(1);
    };

    const openModal = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
            <div className="filter-bar">
                <TextField
                    label="Search Recipes"
                    variant="outlined"
                    fullWidth
                    value={filter}
                    onChange={handleFilterChange}
                    style={{ marginBottom: '20px' }}
                />
            </div>
            <div className="recipe-list">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} openModal={openModal} />
                ))}
            </div>
            {loading && <CircularProgress />}
            {hasMore && !loading && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={loadMoreRecipes}
                    style={{ marginTop: '20px' }}
                >
                    Load More
                </Button>
            )}
            {isModalOpen && selectedRecipe && (
                <FullRecipeModal recipe={selectedRecipe} closeModal={closeModal} isAuthenticated={isAuthenticated} />
            )}
        </div>
    );
};

export default Home;
