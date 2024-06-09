const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Route pour obtenir tous les utilisateurs
router.get('/', protect, getAllUsers);

// Route pour mettre à jour un utilisateur
router.put('/:id', protect, updateUser);

// Route pour supprimer un utilisateur
router.delete('/:id', protect, deleteUser);

module.exports = router;
