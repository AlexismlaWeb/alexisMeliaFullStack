import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, List, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../AuthContext';

const RecipesTable = () => {
    const [recipes, setRecipes] = useState([]);
    const [editRecipe, setEditRecipe] = useState(null);
    const [deleteRecipe, setDeleteRecipe] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                const recipeData = await response.json();
                setRecipes(recipeData);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [token]);

    const handleDelete = async (recipeId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete recipe');
            }
            setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
            setDeleteRecipe(null);  // Close the delete confirmation dialog
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const handleEdit = (recipe) => {
        setEditRecipe(recipe);
    };

    const handleEditClose = () => {
        setEditRecipe(null);
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes/${editRecipe._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editRecipe)
            });
            if (!response.ok) {
                throw new Error('Failed to update recipe');
            }
            const updatedRecipe = await response.json();
            setRecipes(recipes.map(recipe => (recipe._id === updatedRecipe._id ? updatedRecipe : recipe)));
            handleEditClose();
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditRecipe({
            ...editRecipe,
            [name]: value
        });
    };

    const handleIngredientsChange = (e, index) => {
        const newIngredients = [...editRecipe.ingredients];
        newIngredients[index] = e.target.value;
        setEditRecipe({
            ...editRecipe,
            ingredients: newIngredients
        });
    };

    const handleDeleteClick = (recipe) => {
        setDeleteRecipe(recipe);
    };

    const handleDeleteConfirm = () => {
        handleDelete(deleteRecipe._id);
    };

    const handleDeleteClose = () => {
        setDeleteRecipe(null);
    };

    const addIngredientField = () => {
        setEditRecipe({
            ...editRecipe,
            ingredients: [...editRecipe.ingredients, '']
        });
    };

    const removeIngredientField = (index) => {
        const newIngredients = editRecipe.ingredients.filter((_, i) => i !== index);
        setEditRecipe({
            ...editRecipe,
            ingredients: newIngredients
        });
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Ingredients</TableCell>
                            <TableCell>Instructions</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Likes</TableCell>
                            <TableCell>Saved By</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recipes.map((recipe) => (
                            <TableRow key={recipe._id}>
                                <TableCell>{recipe.title}</TableCell>
                                <TableCell>{recipe.description}</TableCell>
                                <TableCell>
                                    <List>
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={ingredient} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </TableCell>
                                <TableCell>{recipe.instructions}</TableCell>
                                <TableCell>{recipe.author.username}</TableCell>
                                <TableCell>{recipe.likes}</TableCell>
                                <TableCell>{recipe.savedBy.length}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" style={{ marginInline: '2px' }} startIcon={<EditIcon />} onClick={() => handleEdit(recipe)}>Edit</Button>
                                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(recipe)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {editRecipe && (
                <Dialog open={true} onClose={handleEditClose}>
                    <DialogTitle>Edit Recipe</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Title"
                            type="text"
                            fullWidth
                            name="title"
                            value={editRecipe.title}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            name="description"
                            value={editRecipe.description}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Instructions"
                            type="text"
                            fullWidth
                            name="instructions"
                            value={editRecipe.instructions}
                            onChange={handleInputChange}
                        />
                        <DialogContent>
                            <DialogTitle>Ingredients</DialogTitle>
                            {editRecipe.ingredients.map((ingredient, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        margin="dense"
                                        label={`Ingredient ${index + 1}`}
                                        type="text"
                                        fullWidth
                                        value={ingredient}
                                        onChange={(e) => handleIngredientsChange(e, index)}
                                    />
                                    <Button onClick={() => removeIngredientField(index)}>Remove</Button>
                                </div>
                            ))}
                            <Button onClick={addIngredientField}>Add Ingredient</Button>
                        </DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">Cancel</Button>
                        <Button onClick={handleEditSave} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            )}

            {deleteRecipe && (
                <Dialog open={true} onClose={handleDeleteClose}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete recipe "{deleteRecipe.title}"?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteClose} color="primary">Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default RecipesTable;
