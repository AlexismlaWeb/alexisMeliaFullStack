const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
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
    loginUser
};
