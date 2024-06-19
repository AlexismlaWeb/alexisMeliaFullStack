import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../AuthContext'; // Importez le hook useAuth depuis votre contexte d'authentification

const Navbar = ({ isAuthenticated, isAdmin }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { updateAuthState } = useAuth(); // Utilisez le hook useAuth pour accéder à setIsAuthenticated et setIsAdmin

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        updateAuthState(false, false); // Met à jour l'état de l'authentification et de l'administration à false
      };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    DélicesPartagés
                </Typography>
                <div>
                    <Button color="inherit" component={Link} to="/">Accueil</Button>
                    <Button color="inherit" component={Link} to="/profile">Profil</Button>
                    {isAdmin && (
                        <Button
                        color="inherit" component={Link} to="/admin"
                      >
                        Admin
                      </Button>
                    )}
                    {isAuthenticated && <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>}
                {!isAuthenticated && (
                    <>
                        <Button color="inherit" component={Link} to="/login">Connexion</Button>
                    </>
                )}
                </div>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose} component={Link} to="/admin">
                        Admin
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
