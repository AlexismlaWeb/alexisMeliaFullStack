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

const getAllRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = '' } = req.query;
        const query = filter ? { title: { $regex: filter, $options: 'i' } } : {};

        const recipes = await Recipe.find(query)
            .populate('author', 'username')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalRecipes = await Recipe.countDocuments(query);

        res.json({ recipes, totalRecipes });
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

        await Recipe.findByIdAndDelete(id);


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
const getUserRecipes = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupérer le token des en-têtes de la requête
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token
        const userId = decoded.id; // Extraire l'ID de l'utilisateur du token
        console.log('User ID:', userId); // Afficher l'ID de l'utilisateur dans la console (facultatif)

        const recipes = await Recipe.find({ author: userId });

        if (!recipes || recipes.length === 0) { // Vérifier si aucune recette n'a été trouvée
            return res.status(404).json({ message: 'No recipes found' });
        } else {
            return res.json(recipes);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Récupérer les recettes enregistrées par un utilisateur
const getSavedRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ savedBy: req.user._id });
        if (!recipes) {
            return res.status(404).json({ message: 'No saved recipes found' });
        }else{
            return res.json(recipes);
        }
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
    saveRecipe,
    getUserRecipes,
    getSavedRecipes
};