import React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const FullRecipeModal = ({ recipe, isAuthenticated, handleLike, handleSave, closeModal }) => {
    return (
        <Dialog open={true} onClose={closeModal}>
            <DialogTitle>{recipe.title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">{recipe.description}</Typography>
                <Typography variant="h6">Ingredients</Typography>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
                <Typography variant="h6">Instructions</Typography>
                <Typography variant="body1">{recipe.instructions}</Typography>
                <div>
                    {isAuthenticated && (
                        <div>
                            <Button onClick={handleLike} startIcon={<FavoriteIcon />}>Like</Button>
                            <Button onClick={handleSave} startIcon={<BookmarkIcon />}>Save</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FullRecipeModal;
