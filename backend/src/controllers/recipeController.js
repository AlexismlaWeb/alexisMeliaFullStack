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
            author: req.user._id // L'utilisateur actuellement connecté est l'auteur de la recette
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour récupérer toutes les recettes
const getAllRecipes = async (req, res) => {
    try {
        let recipes;

        // Vérifie si l'utilisateur est un administrateur
        if (req.user.admin) {
            recipes = await Recipe.find().populate('author', 'username');
        } else {
            recipes = await Recipe.find({ author: req.user._id }).populate('author', 'username');
        }

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

        // Vérifier si l'utilisateur actuel est l'auteur de la recette ou un administrateur
        if (recipe.author.toString() !== req.user._id.toString() && !req.user.admin) {
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

        // Vérifier si l'utilisateur actuel est l'auteur de la recette ou un administrateur
        if (recipe.author.toString() !== req.user._id.toString() && !req.user.admin) {
            return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
        }

        await recipe.remove();

        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likeRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        recipe.likes += 1;
        await recipe.save();

        res.json({ message: 'Recipe liked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour enregistrer une recette
const saveRecipe = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (!recipe.savedBy.includes(userId)) {
            recipe.savedBy.push(userId);
            await recipe.save();
        }

        res.json({ message: 'Recipe saved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe
};