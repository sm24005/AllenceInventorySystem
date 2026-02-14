import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, CircularProgress, Alert 
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    Badge as BadgeIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon
} from '@mui/icons-material';

import { createCustomer } from '../../services/customerService';

const CreateCustomerPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        nationalId: '',
        phone: '',
        email: '',
        address: ''
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
            await createCustomer(formData);
            navigate('/customers');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error creating customer';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')} color="inherit">
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Register New Customer
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                                PERSONAL INFORMATION
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="National ID (DUI)"
                                name="nationalId"
                                value={formData.nationalId}
                                onChange={handleChange}
                                required
                                placeholder="00000000-0"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><BadgeIcon fontSize="small"/></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                             <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                                CONTACT DETAILS
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small"/></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small"/></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                multiline
                                rows={2}
                                value={formData.address}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{mt:1}}><HomeIcon fontSize="small"/></InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate('/customers')}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                            >
                                {loading ? 'Saving...' : 'Save Customer'}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateCustomerPage;