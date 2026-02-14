import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Chip, TextField, 
    InputAdornment, LinearProgress
} from '@mui/material';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Search as SearchIcon,
    Inventory as InventoryIcon
} from '@mui/icons-material';

import { getProducts, deleteProduct } from '../../services/productService';
import { getAuthUser } from '../../utils/auth';

const ProductsPage = () => {
    const navigate = useNavigate();
    const user = getAuthUser();
    
    // Estados
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Permisos: Solo Admin y Manager pueden Editar/Borrar
    const canEdit = ['ADMIN', 'MANAGER'].includes(user?.role);
    const canDelete = ['ADMIN'].includes(user?.role);

    // Cargar productos
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await getProducts({ name: searchTerm });
            // Tu backend devuelve { success: true, products: [...] } o directamente el array
            setProducts(data.products || data); 
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Carga inicial

    // Manejar eliminación
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                fetchProducts(); // Recargar lista
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    return (
        <Box>
            {/* Cabecera */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Inventory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your products catalog
                    </Typography>
                </Box>
                {canEdit && (
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/products/create')}
                    >
                        New Product
                    </Button>
                )}
            </Box>

            {/* Buscador */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField 
                    size="small" 
                    placeholder="Search by name..." 
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
                />
                <Button variant="outlined" onClick={fetchProducts}>
                    Search
                </Button>
            </Paper>

            {/* Tabla */}
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                {loading && <LinearProgress />}
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SKU</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Brand</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loading && products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                        <InventoryIcon sx={{ fontSize: 60, mb: 1 }} />
                                        <Typography>No products found</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product._id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {product.sku || product.code}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{product.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{product.description?.substring(0, 30)}...</Typography>
                                    </TableCell>
                                    <TableCell>{product.brand || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip label={product.category || 'General'} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={product.stock} 
                                            color={product.stock < 10 ? "error" : "success"} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {canEdit && (
                                            <IconButton color="primary" size="small" onClick={() => navigate(`/products/edit/${product._id}`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {canDelete && (
                                            <IconButton color="error" size="small" onClick={() => handleDelete(product._id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProductsPage;