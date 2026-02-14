import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { AddShoppingCart as AddIcon, History as HistoryIcon } from '@mui/icons-material';

import { getPurchases } from '../../services/purchaseService';

const PurchasesPage = () => {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await getPurchases();
                setPurchases(data.purchases || []);
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h4" color="primary" fontWeight="bold">Purchases (Inbound)</Typography>
                    <Typography variant="body2" color="text.secondary">Inventory Restocking History</Typography>
                </Box>
                <Box>
                    <Button sx={{ mr: 2 }} onClick={() => navigate('/suppliers')}>Manage Suppliers</Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/purchases/create')}>
                        Register Purchase
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.main' }}> {/* Usamos Secondary para diferenciar de Ventas */}
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white' }}>Supplier</TableCell>
                            <TableCell sx={{ color: 'white' }}>Invoice #</TableCell>
                            <TableCell sx={{ color: 'white' }}>Items Restocked</TableCell>
                            <TableCell sx={{ color: 'white', textAlign: 'right' }}>Total Cost</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchases.map((p) => (
                            <TableRow key={p._id}>
                                <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{p.supplier?.name || 'Unknown'}</TableCell>
                                <TableCell>{p.invoiceNumber}</TableCell>
                                <TableCell>
                                    <Chip label={`${p.items.length} products`} size="small" />
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>${p.total?.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        {purchases.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No purchases recorded.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PurchasesPage;