import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../AuthContext';

const UsersTable = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/user`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const userData = await response.json();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [token]);

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            setUsers(users.filter(user => user._id !== userId));
            setDeleteUser(null);  // Close the delete confirmation dialog
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
    };

    const handleEditClose = () => {
        setEditUser(null);
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/user/${editUser._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editUser)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            const updatedUser = await response.json();
            setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
            handleEditClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser({
            ...editUser,
            [name]: value
        });
    };

    const handleAdminChange = (e) => {
        setEditUser({
            ...editUser,
            admin: e.target.value === 'true'
        });
    };

    const handleDeleteClick = (user) => {
        setDeleteUser(user);
    };

    const handleDeleteConfirm = () => {
        handleDelete(deleteUser._id);
    };

    const handleDeleteClose = () => {
        setDeleteUser(null);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.admin ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" style={{ marginInline: '10px' }} startIcon={<EditIcon />} onClick={() => handleEdit(user)}>Edit</Button>
                                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(user)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {editUser && (
                <Dialog open={true} onClose={handleEditClose}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Username"
                            type="text"
                            fullWidth
                            name="username"
                            value={editUser.username}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            name="email"
                            value={editUser.email}
                            onChange={handleInputChange}
                        />
                        <Select
                            margin="dense"
                            label="Admin"
                            fullWidth
                            name="admin"
                            value={editUser.admin ? 'true' : 'false'}
                            onChange={handleAdminChange}
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">Cancel</Button>
                        <Button onClick={handleEditSave} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            )}

            {deleteUser && (
                <Dialog open={true} onClose={handleDeleteClose}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete user {deleteUser.username}?
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

export default UsersTable;
