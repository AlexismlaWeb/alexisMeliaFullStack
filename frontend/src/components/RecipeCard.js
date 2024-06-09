import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

const RecipeCard = ({ recipe }) => {
    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={recipe.imageUrl} // Ajoute la propriété imageUrl à ta recette si tu veux afficher une image
                    alt={recipe.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipe.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default RecipeCard;
