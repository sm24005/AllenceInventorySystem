import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, 
    IconButton, Autocomplete, Divider, Alert, Card, CardContent, CircularProgress
} from '@mui/material';
import { 
    Delete as DeleteIcon, 
    ShoppingCartCheckout as CheckoutIcon,
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';

import { getProducts } from '../../services/productService';
import { getCustomers } from '../../services/customerService';
import { createSale } from '../../services/saleService';

const CreateSalePage = () => {
    const navigate = useNavigate();
    
    // Datos maestros
    const [allProducts, setAllProducts] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);

    // Estado de la venta
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dataLoading, setDataLoading] = useState(true); // Nuevo estado de carga inicial

    // Cargar productos y clientes al iniciar
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsRes = await getProducts();
                const customersRes = await getCustomers();
                
                // --- PARCHE DE SEGURIDAD ---
                // Verificamos si es array o si viene dentro de .products
                const rawProducts = productsRes.data.products || productsRes.data;
                const rawCustomers = customersRes.data.customers || customersRes.data;

                // Validación estricta para evitar pantalla blanca
                const validProducts = Array.isArray(rawProducts) ? rawProducts : [];
                const validCustomers = Array.isArray(rawCustomers) ? rawCustomers : [];

                // Filtramos solo productos con stock > 0
                const availableProducts = validProducts.filter(p => p && p.stock > 0);
                
                setAllProducts(availableProducts);
                setAllCustomers(validCustomers);
            } catch (err) {
                console.error("Error crítico cargando POS:", err);
                setError("Error connection to server. Check console for details.");
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    // Agregar producto al carrito
    const addToCart = (product) => {
        if (!product) return; // Seguridad extra
        const existingItem = cart.find(item => item.product._id === product._id);

        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                updateQuantity(product._id, existingItem.quantity + 1);
            } else {
                alert(`Max stock reached for ${product.name}`);
            }
        } else {
            setCart([...cart, { product, quantity: 1, subtotal: product.price }]);
        }
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
        
        setCart(cart.map(item => {
            if (item.product._id === productId) {
                if (newQty > item.product.stock) {
                    alert(`Not enough stock. Max: ${item.product.stock}`);
                    return item;
                }
                return { 
                    ...item, 
                    quantity: newQty, 
                    subtotal: item.product.price * newQty 
                };
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product._id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + item.subtotal, 0);
    };

    const handleCheckout = async () => {
        if (!selectedCustomer) {
            setError("Please select a customer.");
            return;
        }
        if (cart.length === 0) {
            setError("Cart is empty.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const saleData = {
                customerId: selectedCustomer._id,
                items: cart.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity
                }))
            };

            await createSale(saleData);
            alert("Sale registered successfully! 🎉");
            navigate('/sales');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Error processing sale";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Renderizado de seguridad si está cargando datos
    if (dataLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading POS System...</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 100px)' }}>
            
            {/* IZQUIERDA: Selector de Productos */}
            <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/sales')}>
                        Exit
                    </Button>
                    <Typography variant="h5" fontWeight="bold">Point of Sale</Typography>
                </Box>

                <Paper sx={{ p: 2, mb: 2, flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <Autocomplete
                        options={allProducts}
                        getOptionLabel={(option) => option ? `${option.name} - $${option.price}` : ''}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => <TextField {...params} label="Search Product..." fullWidth />}
                        onChange={(e, value) => {
                            if (value) addToCart(value);
                        }}
                        sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Quick Add (Click to add)
                    </Typography>
                    
                    <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            {allProducts.length === 0 && (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" align="center">No products with stock available.</Typography>
                                </Grid>
                            )}
                            {allProducts.map((product) => (
                                <Grid item xs={6} sm={4} key={product._id}>
                                    <Card 
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' }, height: '100%' }}
                                        onClick={() => addToCart(product)}
                                    >
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Typography variant="subtitle2" noWrap fontWeight="bold">{product.name}</Typography>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                SKU: {product.sku}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography color="primary" fontWeight="bold">${product.price}</Typography>
                                                <Typography variant="caption" sx={{ bgcolor: '#e8f5e9', px: 1, borderRadius: 1, color: '#2e7d32' }}>
                                                    {product.stock} left
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            {/* DERECHA: Carrito y Checkout */}
            <Grid item xs={12} md={5} sx={{ height: '100%' }}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0, overflow: 'hidden' }}>
                    
                    <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6">Current Sale</Typography>
                        <Autocomplete
                            options={allCustomers}
                            getOptionLabel={(option) => option ? `${option.name} (${option.nationalId})` : ''}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            value={selectedCustomer}
                            onChange={(e, val) => setSelectedCustomer(val)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    placeholder="Select Customer" 
                                    variant="standard" 
                                    sx={{ 
                                        input: { color: 'white' }, 
                                        '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }} 
                                />
                            )}
                            sx={{ mt: 2 }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                        {cart.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, opacity: 0.5 }}>
                                <CheckoutIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography>Cart is empty</Typography>
                            </Box>
                        ) : (
                            cart.map((item) => (
                                <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2">{item.product.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">${item.product.price} x {item.quantity}</Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton size="small" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography>{item.quantity}</Typography>
                                        <IconButton size="small" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    
                                    <Typography variant="subtitle2" sx={{ ml: 2, width: 60, textAlign: 'right' }}>
                                        ${item.subtotal.toFixed(2)}
                                    </Typography>
                                    
                                    <IconButton size="small" color="error" onClick={() => removeFromCart(item.product._id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))
                        )}
                    </Box>

                    <Divider />
                    <Box sx={{ p: 3, bgcolor: '#f9f9f9' }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography>${calculateTotal().toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h5" fontWeight="bold">Total</Typography>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                                ${calculateTotal().toFixed(2)}
                            </Typography>
                        </Box>

                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            startIcon={<CheckoutIcon />}
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? 'Processing...' : 'COMPLETE SALE'}
                        </Button>
                    </Box>

                </Paper>
            </Grid>
        </Grid>
    );
};

export default CreateSalePage;