const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
    // Extrayez le token JWT de l'en-tête Authorization
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        // Vérifiez si le token est valide et obtenez les données de l'utilisateur à partir du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Recherchez l'utilisateur dans la base de données
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Renvoyer les informations du profil de l'utilisateur
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour obtenir tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        // Vérifie si l'utilisateur est un administrateur
        if (!req.user.admin) {
            return res.status(403).json({ message: 'You are not authorized to access this resource' });
        }

        const users = await User.find().select('-password'); // Exclut le champ mot de passe

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour mettre à jour un utilisateur
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, admin } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Vérifie si l'utilisateur actuel est un administrateur
        if (!req.user.admin) {
            return res.status(403).json({ message: 'You are not authorized to update this user' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.admin = admin || user.admin;

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour supprimer un utilisateur
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify if the current user is an admin
        if (!req.user.admin) {
            return res.status(403).json({ message: 'You are not authorized to delete this user' });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserProfile
};
