import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, MenuItem, CircularProgress, Alert, Skeleton
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Security as SecurityIcon,
    ToggleOn as StatusIcon
} from '@mui/icons-material';

import { getUserById, updateUser } from '../../services/userService';

const EditUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '', // Opcional
        role: '',
        status: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await getUserById(id);
                const user = data.user || data;
                
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    password: '', // No cargamos la contraseña encriptada
                    role: user.role || 'SELLER',
                    status: user.status || 'active'
                });
            } catch (err) {
                console.error(err);
                setError('Could not load user details.');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Solo enviamos lo necesario
            const dataToSend = { ...formData };
            if (!dataToSend.password) delete dataToSend.password; // Si está vacía, no la enviamos

            await updateUser(id, dataToSend);
            navigate('/users');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error updating user';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <Box maxWidth="md" sx={{ mx: 'auto', mt: 4 }}>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} color="inherit">
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Edit User
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                                ACCOUNT DETAILS
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small"/></InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave empty to keep current"
                                helperText="Only fill this if you want to change the password"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LockIcon fontSize="small"/></InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem value="SELLER">SELLER</MenuItem>
                                <MenuItem value="MANAGER">MANAGER</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><StatusIcon fontSize="small"/></InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive (Access Denied)</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate('/users')}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                            >
                                {saving ? 'Updating...' : 'Update User'}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditUserPage;