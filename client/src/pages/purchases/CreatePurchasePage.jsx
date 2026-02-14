import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, Grid, Autocomplete, 
    Table, TableBody, TableCell, TableHead, TableRow, IconButton, Alert 
} from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';

import { getProducts } from '../../services/productService';
import { getSuppliers } from '../../services/supplierService';
import { createPurchase } from '../../services/purchaseService';

const CreatePurchasePage = () => {
    const navigate = useNavigate();
    
    // Listas
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    
    // Formulario
    const [supplier, setSupplier] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [cart, setCart] = useState([]); // { product, quantity, unitCost }

    useEffect(() => {
        const loadData = async () => {
            const pRes = await getProducts();
            const sRes = await getSuppliers();
            setProducts(pRes.data.products || []);
            setSuppliers(sRes.data.suppliers || []);
        };
        loadData();
    }, []);

    const addToCart = (product) => {
        if (!product) return;
        const exists = cart.find(item => item.product._id === product._id);
        if (exists) return alert("Product already in list");

        setCart([...cart, { 
            product, 
            quantity: 1, 
            unitCost: 0 // Empezamos en 0, el usuario debe poner el costo real
        }]);
    };

    const updateItem = (id, field, value) => {
        setCart(cart.map(item => item.product._id === id ? { ...item, [field]: parseFloat(value) || 0 } : item));
    };

    const handleSave = async () => {
        if (!supplier || !invoiceNumber || cart.length === 0) return alert("Please fill all fields");

        try {
            await createPurchase({
                supplierId: supplier._id,
                invoiceNumber,
                items: cart.map(i => ({ productId: i.product._id, quantity: i.quantity, unitCost: i.unitCost }))
            });
            alert("Stock Updated! 📈");
            navigate('/purchases');
        } catch (error) {
            alert("Error registering purchase");
        }
    };

    return (
        <Box>
            <Button startIcon={<BackIcon />} onClick={() => navigate('/purchases')} sx={{ mb: 2 }}>Back</Button>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Register Incoming Stock</Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={suppliers}
                            getOptionLabel={(s) => s.name}
                            onChange={(e, val) => setSupplier(val)}
                            renderInput={(params) => <TextField {...params} label="Select Supplier" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="Supplier Invoice #" 
                            value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={products}
                            getOptionLabel={(p) => `${p.name} (Current Stock: ${p.stock})`}
                            onChange={(e, val) => addToCart(val)}
                            renderInput={(params) => <TextField {...params} label="Search Product to Add..." />}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell width={150}>Quantity (Add)</TableCell>
                            <TableCell width={150}>Unit Cost ($)</TableCell>
                            <TableCell width={150}>Total Line</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((item) => (
                            <TableRow key={item.product._id}>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>
                                    <TextField 
                                        type="number" size="small" value={item.quantity}
                                        onChange={(e) => updateItem(item.product._id, 'quantity', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField 
                                        type="number" size="small" value={item.unitCost}
                                        onChange={(e) => updateItem(item.product._id, 'unitCost', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>${(item.quantity * item.unitCost).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="error" onClick={() => setCart(cart.filter(i => i !== item))}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="large" startIcon={<SaveIcon />} onClick={handleSave}>
                        Confirm Purchase & Update Stock
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreatePurchasePage;