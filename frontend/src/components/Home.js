import React from 'react';
import Navbar from './Navbar'; // Importe ton composant de barre de navigation
import RecipeCard from './RecipeCard'; // Importe ton composant de carte de recette
import { useAuth } from '../AuthContext'; // Importez le hook useAuth depuis votre contexte d'authentification

const Home = () => {
    const { isAuthenticated, isAdmin } = useAuth(); // Utilise le hook useAuth pour obtenir l'état de l'authentification et des informations sur l'utilisateur connecté
    console.log(isAuthenticated, isAdmin);
    const recipes = [
        { id: 1, title: 'Poulet rôti', image: 'poulet.jpg', description: 'Une délicieuse recette de poulet rôti.' },
        { id: 2, title: 'Pâtes carbonara', image: 'carbonara.jpg', description: 'La recette classique des pâtes carbonara.' },
        // Ajoute d'autres recettes ici...
    ];

    return (
        <div>
            <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} /> {/* Barre de navigation */}
            <div className="recipe-list">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
};

export default Home;
