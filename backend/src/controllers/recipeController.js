const Recipe = require('../models/recipeModel');

// Contrôleur pour créer une recette
const createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions } = req.body;

    try {
        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            author: req.user._id // Utilisateur actuellement connecté est l'auteur de la recette
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour récupérer toutes les recettes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author', 'username'); // Populate pour inclure le nom de l'auteur

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour récupérer une recette par son ID
const getRecipeById = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour mettre à jour une recette
const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions } = req.body;

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Vérifier si l'utilisateur actuel est l'auteur de la recette
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this recipe' });
        }

        recipe.title = title;
        recipe.description = description;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;

        await recipe.save();

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour supprimer une recette
const deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Vérifier si l'utilisateur actuel est l'auteur de la recette
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
        }

        await recipe.remove();

        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe
};
