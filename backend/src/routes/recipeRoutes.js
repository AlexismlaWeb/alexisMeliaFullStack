const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');

const router = express.Router();

router.route('/')
    .get(getAllRecipes)
    .post(protect, createRecipe);

router.route('/:id')
    .get(getRecipeById)
    .put(protect, updateRecipe)
    .delete(protect, deleteRecipe);

module.exports = router;
