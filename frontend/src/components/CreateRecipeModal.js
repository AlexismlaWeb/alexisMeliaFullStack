import React, { useState } from 'react';
import { Modal, Button, TextField} from '@mui/material';

const CreateRecipeModal = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        await fetch(`${process.env.REACT_APP_BACKEND_API}/api/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajoutez le token JWT stocké dans localStorage
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create recipe');
            }
            return response.json();
        })
        .then(data => {
            console.log('Recipe created:', data);
            handleClose(); // Fermez le modal après la création de la recette
        })
        .catch(error => {
            console.error('Error creating recipe:', error);
            // Gérer les erreurs lors de la création de la recette
        });
    };

    return (
        <div>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-recipe-modal"
            aria-describedby="create-recipe-form"
        >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
                <h2 id="create-recipe-modal">Create a Recipe</h2>
                <form id="create-recipe-form">
                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <TextField
                        label="Ingredients"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <TextField
                        label="Instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={6}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSubmit}>Create</Button>
                </form>
            </div>
        </Modal>
        </div>
    
    );
};

export default CreateRecipeModal;
