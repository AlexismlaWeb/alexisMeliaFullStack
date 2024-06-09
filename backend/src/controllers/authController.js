const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Contrôleur pour la création d'un nouvel utilisateur
const registerUser = async (req, res) => {
    const { username, email, password, admin } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Créer un nouvel utilisateur
        const user = await User.create({ username, email, password, admin});

        // Générer un token JWT pour le nouvel utilisateur
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
            admin: user.admin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Contrôleur pour la connexion
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const isAdmin = user.admin; // Vérifie si l'utilisateur est un administrateur
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                admin: isAdmin, // Renvoie le statut admin de l'utilisateur dans la réponse
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};
