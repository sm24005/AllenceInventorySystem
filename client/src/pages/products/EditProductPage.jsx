import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, CircularProgress, Alert, Skeleton
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    AttachMoney as AttachMoneyIcon,
    Inventory as InventoryIcon
} from '@mui/icons-material';

import { getProductById, updateProduct } from '../../services/productService';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await getProductById(id);
                
                // Extraemos 'product' de 'data'
                const product = data.product || data; 

                setFormData({
                    name: product.name || '',
                    sku: product.sku || product.code || '',
                    brand: product.brand || '',
                    category: product.category || '',
                    price: product.price || 0,
                    stock: product.stock || 0,
                    description: product.description || ''
                });
            } catch (err) {
                console.error(err);
                setError('Could not load product details.');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) fetchProduct();
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
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };
            
            await updateProduct(id, productData);
            navigate('/products');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error updating product';
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
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} color="inherit">
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Edit Product
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
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
                                InputLabelProps={{ shrink: true }} // Fuerza que la etiqueta no se sobreponga
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                disabled
                                helperText="Unique code (cannot be changed)"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

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
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><InventoryIcon fontSize="small"/></InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate('/products')}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                            >
                                {saving ? 'Updating...' : 'Update Product'}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditProductPage;