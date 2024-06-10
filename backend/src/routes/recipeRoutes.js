const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe,
    getUserRecipes,
    getSavedRecipes
} = require('../controllers/recipeController');

const router = express.Router();

// Route pour créer une recette
router.post('/', protect, createRecipe);

// Route pour récupérer toutes les recettes
router.get('/', protect, getAllRecipes);

// Route pour récupérer une recette par son ID
router.get('/:id', getRecipeById);

// Route pour mettre à jour une recette
router.put('/:id', protect, updateRecipe);

// Route pour supprimer une recette
router.delete('/:id', protect, deleteRecipe);

// Route pour liker une recette
router.post('/:id/like', protect, likeRecipe);

// Route pour enregistrer une recette
router.post('/:id/save', protect, saveRecipe);

// Route pour obtenir les recettes créées par l'utilisateur connecté
router.get('/myrecipes', getUserRecipes);

// Route pour obtenir les recettes enregistrées par l'utilisateur connecté
router.get('/savedrecipes', protect, getSavedRecipes);

module.exports = router;
