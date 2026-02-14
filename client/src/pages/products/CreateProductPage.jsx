import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    InputAdornment, CircularProgress, Alert, Autocomplete 
} from '@mui/material';
import { 
    Save as SaveIcon, 
    ArrowBack as ArrowBackIcon,
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
    Category as CategoryIcon,
    Label as BrandIcon
} from '@mui/icons-material';

import { createProduct } from '../../services/productService';
// Asegúrate de que estos archivos existan en client/src/services/
import { getCategories } from '../../services/categoryService';
import { getBrands } from '../../services/brandService';

const CreateProductPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Listas maestras (iniciamos con arrays vacíos para evitar errores)
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

    // Cargar listas al iniciar
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                // Intentamos cargar las listas, si falla alguna, no rompe la página
                const catRes = await getCategories().catch(e => ({ data: { categories: [] } }));
                const brandRes = await getBrands().catch(e => ({ data: { brands: [] } }));
                
                setCategoriesList(catRes.data?.categories || []);
                setBrandsList(brandRes.data?.brands || []);
            } catch (err) {
                console.error("Error loading master data", err);
            }
        };
        fetchMasterData();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createProduct(formData);
            navigate('/products');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error creating product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} color="inherit">
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">Create New Product</Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="SKU (Barcode)" name="sku"
                                value={formData.sku} onChange={handleChange} required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="Product Name" name="name"
                                value={formData.name} onChange={handleChange} required
                            />
                        </Grid>

                        {/* Selector de CATEGORÍA (Protegido) */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={categoriesList}
                                // Corrección: Maneja si la opción es un string o un objeto
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name) || ''}
                                freeSolo 
                                onInputChange={(event, newInputValue) => {
                                    setFormData(prev => ({ ...prev, category: newInputValue }));
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Category" 
                                        required
                                        placeholder="Select or type..."
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

                        {/* Selector de MARCA (Protegido) */}
                        <Grid item xs={12} md={6}>
                             <Autocomplete
                                options={brandsList}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name) || ''}
                                freeSolo
                                onInputChange={(event, newInputValue) => {
                                    setFormData(prev => ({ ...prev, brand: newInputValue }));
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Brand" 
                                        required
                                        placeholder="Select or type..."
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth label="Initial Stock" name="stock" type="number"
                                value={formData.stock} onChange={handleChange} required
                                InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon fontSize="small"/></InputAdornment> }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Description" name="description" multiline rows={3}
                                value={formData.description} onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate('/products')}>Cancel</Button>
                            <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20}/> : <SaveIcon />}>
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