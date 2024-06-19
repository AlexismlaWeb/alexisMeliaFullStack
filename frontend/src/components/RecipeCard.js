import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Button} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const RecipeCard = ({ recipe, isAuthenticated, openModal }) => {
    const handleLike = async () => {
        openModal(recipe._id);
    };

    const handleSave = async () => {
        openModal(recipe._id);
    };
    return (
        <Card>
            <CardActionArea onClick={() => openModal(recipe)}> {/* Appeler la fonction openModal avec la recette en paramètre */}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipe.description}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Likes: {recipe.likes}</Typography>
                        {isAuthenticated && (
                           <div>
                           <Button onClick={handleLike} startIcon={<FavoriteIcon />}>Like</Button>
                           <Button onClick={handleSave} startIcon={<BookmarkIcon />}>Save</Button>
                       </div>
                        )}
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default RecipeCard;
