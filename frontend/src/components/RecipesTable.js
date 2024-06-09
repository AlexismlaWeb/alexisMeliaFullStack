// RecipesTable.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../AuthContext';

const RecipesTable = () => {
    const [recipes, setRecipes] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes`,
               { method: 'GET',
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
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Author</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recipes.map((recipe) => (
                        <TableRow key={recipe._id}>
                            <TableCell>{recipe.title}</TableCell>
                            <TableCell>{recipe.description}</TableCell>
                            <TableCell>{recipe.author.username}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RecipesTable;
