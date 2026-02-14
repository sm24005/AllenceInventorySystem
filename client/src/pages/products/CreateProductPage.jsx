import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, MenuItem, CircularProgress, Alert 
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    AttachMoney as AttachMoneyIcon,
    Inventory as InventoryIcon
} from '@mui/icons-material';

import { createProduct } from '../../services/productService';

const CreateProductPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        brand: '',
        category: '',
        price: '',
        stock: '',
        description: ''
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
            // Convertir números
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };
            
            await createProduct(productData);
            navigate('/products'); // Regresar a la lista
        } catch (err) {
            console.error(err);
            // Extraer mensaje de error del backend
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Error creating product';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            {/* Cabecera */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} color="inherit">
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Register New Product
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        {/* Sección 1: Identificación */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                                BASIC INFORMATION
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Product Name"
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
                                label="SKU (Unique Code)"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                helperText="E.g., LAP-DELL-001"
                            />
                        </Grid>

                        {/* Sección 2: Clasificación (Texto por ahora) */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="E.g., Dell, Samsung"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="E.g., Electronics, Laptops"
                            />
                        </Grid>

                        {/* Sección 3: Inventario y Precio */}
                        <Grid item xs={12}>
                             <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                                PRICING & STOCK
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small"/></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Initial Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><InventoryIcon fontSize="small"/></InputAdornment>,
                                }}
                            />
                        </Grid>

                        {/* Descripción */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Botones */}
                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate('/products')}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                            >
                                {loading ? 'Saving...' : 'Save Product'}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateProductPage;