import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, TextField, Button, 
    Table, TableBody, TableCell, TableHead, TableRow, 
    MenuItem, IconButton, Alert, Divider
} from '@mui/material';
import { Search as SearchIcon, Save as SaveIcon, ArrowBack as BackIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { createReturn } from '../../services/returnService';
import { getSales } from '../../services/saleService';

const CreateReturnPage = () => {
    const navigate = useNavigate();
    
    // Paso 1: Buscar Factura
    const [invoiceSearch, setInvoiceSearch] = useState('');
    const [foundSale, setFoundSale] = useState(null);
    const [searchError, setSearchError] = useState('');

    // Paso 2: Configurar Devolución
    const [returnItems, setReturnItems] = useState([]); 
    const [reason, setReason] = useState('');
    
    const handleSearch = async () => {
        setSearchError('');
        setFoundSale(null);
        setReturnItems([]);
        try {
            const { data } = await getSales(); 
            const sale = data.sales.find(s => s.invoiceNumber === invoiceSearch.trim());
            
            if (sale) {
                setFoundSale(sale);
            } else {
                setSearchError('Invoice not found.');
            }
        } catch (error) {
            setSearchError('Error searching invoice.');
        }
    };

    const addItemToReturn = (item) => {
        const productId = item.product._id || item.product;

        // Evitar duplicados
        if (returnItems.find(i => i.productId === productId)) return;

        setReturnItems([...returnItems, {
            productId: productId,
            name: item.productName || 'Unknown Product',
            quantity: 1,
            maxQty: item.quantity,
            condition: 'Good'
        }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...returnItems];
        newItems[index][field] = value;
        setReturnItems(newItems);
    };

    const handleSave = async () => {
        if (returnItems.length === 0) return;

        try {
            await createReturn({
                invoiceNumber: foundSale.invoiceNumber,
                reason,
                items: returnItems.map(i => ({
                    productId: i.productId,
                    quantity: parseInt(i.quantity),
                    condition: i.condition
                }))
            });
            alert("Return processed successfully");
            navigate('/returns');
        } catch (error) {
            console.error(error); // Ver error en consola
            alert("Error processing return: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Button startIcon={<BackIcon />} onClick={() => navigate('/returns')} sx={{ mb: 2 }}>Back</Button>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Process Return</Typography>

            {/* BUSCADOR */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Step 1: Find Original Sale</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField 
                        fullWidth 
                        label="Invoice Number (e.g. INV-1771...)" 
                        value={invoiceSearch}
                        onChange={(e) => setInvoiceSearch(e.target.value)}
                        placeholder="Paste invoice number here"
                    />
                    <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
                        Search
                    </Button>
                </Box>
                {searchError && <Alert severity="error" sx={{ mt: 2 }}>{searchError}</Alert>}
            </Paper>

            {/* RESULTADOS Y SELECCIÓN */}
            {foundSale && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Invoice: {foundSale.invoiceNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Customer: {foundSale.customer?.name} | Date: {new Date(foundSale.createdAt).toLocaleDateString()}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Available Items (Click to Return):</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                        {foundSale.items.map((item, idx) => (
                            <Button key={idx} variant="outlined" size="small" onClick={() => addItemToReturn(item)}>
                                {item.productName || 'Product'} (Qty: {item.quantity})
                            </Button>
                        ))}
                    </Box>

                    {/* TABLA DE DEVOLUCIÓN */}
                    {returnItems.length > 0 && (
                        <>
                            <Table size="small" sx={{ mb: 2 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell width={120}>Qty to Return</TableCell>
                                        <TableCell width={150}>Condition</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {returnItems.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <TextField 
                                                    type="number" size="small" 
                                                    inputProps={{ min: 1, max: item.maxQty }}
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField 
                                                    select size="small" fullWidth
                                                    value={item.condition}
                                                    onChange={(e) => updateItem(idx, 'condition', e.target.value)}
                                                >
                                                    <MenuItem value="Good">Good (Restock)</MenuItem>
                                                    <MenuItem value="Defective">Defective (Discard)</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" size="small" onClick={() => {
                                                    setReturnItems(returnItems.filter((_, i) => i !== idx));
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <TextField 
                                fullWidth label="Reason for Return" 
                                value={reason} onChange={(e) => setReason(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Button 
                                fullWidth variant="contained" color="error" size="large" 
                                startIcon={<SaveIcon />} onClick={handleSave}
                            >
                                Confirm Refund
                            </Button>
                        </>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default CreateReturnPage;