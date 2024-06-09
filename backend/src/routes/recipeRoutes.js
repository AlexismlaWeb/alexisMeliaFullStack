const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe
} = require('../controllers/recipeController');

const router = express.Router();

// Route pour créer une recette
router.post('/', protect, createRecipe);

// Route pour récupérer toutes les recettes
router.get('/', getAllRecipes);

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

module.exports = router;
