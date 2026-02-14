import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, MenuItem, CircularProgress, Alert 
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

import { createUser } from '../../services/userService';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'SELLER' // Valor por defecto
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createUser(formData);
            navigate('/users');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error creating user';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} color="inherit">
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Register New User
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small"/></InputAdornment>,
                                }}
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small"/></InputAdornment>,
                                }}
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
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                helperText="Min. 6 characters recommended"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LockIcon fontSize="small"/></InputAdornment>,
                                }}
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SecurityIcon fontSize="small"/></InputAdornment>,
                                }}
                            >
                                <MenuItem value="SELLER">SELLER (Can Sell & View Customers)</MenuItem>
                                <MenuItem value="MANAGER">MANAGER (Can Edit Inventory)</MenuItem>
                                <MenuItem value="ADMIN">ADMIN (Full Access)</MenuItem>
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
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                            >
                                {loading ? 'Saving...' : 'Create User'}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateUserPage;