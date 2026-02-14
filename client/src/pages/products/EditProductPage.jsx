import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, CircularProgress, Alert, Skeleton, Autocomplete 
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
    Category as CategoryIcon,
    Label as BrandIcon
} from '@mui/icons-material';

import { getProductById, updateProduct } from '../../services/productService';
// Importamos los servicios de listas
import { getCategories } from '../../services/categoryService';
import { getBrands } from '../../services/brandService';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Listas maestras
    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: ''
    });

    useEffect(() => {
        const loadAllData = async () => {
            try {
                // Cargamos Producto, Categorías y Marcas en paralelo
                const [productRes, catRes, brandRes] = await Promise.all([
                    getProductById(id),
                    getCategories().catch(() => ({ data: { categories: [] } })),
                    getBrands().catch(() => ({ data: { brands: [] } }))
                ]);

                const product = productRes.data.product || productRes.data;

                setFormData({
                    sku: product.sku || '',
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    stock: product.stock || '',
                    category: product.category || '',
                    brand: product.brand || ''
                });

                setCategoriesList(catRes.data?.categories || []);
                setBrandsList(brandRes.data?.brands || []);

            } catch (err) {
                console.error(err);
                setError('Could not load product details.');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) loadAllData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await updateProduct(id, formData);
            navigate('/products');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error updating product');
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
                <Typography variant="h5" fontWeight="bold">Edit Product</Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="SKU (Barcode)" name="sku"
                                value={formData.sku} onChange={handleChange} required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="Product Name" name="name"
                                value={formData.name} onChange={handleChange} required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* Selector de CATEGORÍA */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={categoriesList}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name) || ''}
                                freeSolo
                                value={formData.category} // Valor actual
                                onInputChange={(event, newInputValue) => {
                                    setFormData({ ...formData, category: newInputValue });
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Category" 
                                        required
                                        placeholder="Select or type..."
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start"><CategoryIcon fontSize="small"/></InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            )
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Selector de MARCA */}
                        <Grid item xs={12} md={6}>
                             <Autocomplete
                                options={brandsList}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name) || ''}
                                freeSolo
                                value={formData.brand} // Valor actual
                                onInputChange={(event, newInputValue) => {
                                    setFormData({ ...formData, brand: newInputValue });
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Brand" 
                                        required
                                        placeholder="Select or type..."
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start"><BrandIcon fontSize="small"/></InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            )
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="Price ($)" name="price" type="number"
                                value={formData.price} onChange={handleChange} required
                                InputProps={{ startAdornment: <InputAdornment position="start"><MoneyIcon fontSize="small"/></InputAdornment> }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="Stock" name="stock" type="number"
                                value={formData.stock} onChange={handleChange} required
                                InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon fontSize="small"/></InputAdornment> }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Description" name="description" multiline rows={3}
                                value={formData.description} onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate('/products')}>Cancel</Button>
                            <Button type="submit" variant="contained" size="large" disabled={saving} startIcon={saving ? <CircularProgress size={20}/> : <SaveIcon />}>
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