import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Chip, LinearProgress
} from '@mui/material';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Person as PersonIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

import { getUsers, deleteUser } from '../../services/userService';
import { getAuthUser } from '../../utils/auth';

const UsersPage = () => {
    const navigate = useNavigate();
    const currentUser = getAuthUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Solo Admin puede crear/borrar
    const isAdmin = currentUser?.role === 'ADMIN';

    const fetchUsers = async () => {
        try {
            const { data } = await getUsers();
            setUsers(data.users || []);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'error';
            case 'MANAGER': return 'warning';
            case 'SELLER': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        System Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage staff access and roles
                    </Typography>
                </Box>
                {isAdmin && (
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/users/create')}
                    >
                        New User
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                {loading && <LinearProgress />}
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="action" />
                                        <Typography fontWeight="bold">{user.firstName} {user.lastName}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        icon={<SecurityIcon fontSize="small"/>}
                                        label={user.role} 
                                        color={getRoleColor(user.role)} 
                                        size="small" 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.status || 'active'} 
                                        color={user.status === 'active' ? 'success' : 'default'} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {isAdmin && (
                                        <>
                                            <IconButton color="primary" size="small" onClick={() => navigate(`/users/edit/${user._id}`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            {/* No permitir borrarse a sí mismo */}
                                            {user._id !== currentUser.id && (
                                                <IconButton color="error" size="small" onClick={() => handleDelete(user._id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UsersPage;