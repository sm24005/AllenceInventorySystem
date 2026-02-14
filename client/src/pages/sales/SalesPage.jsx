import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, LinearProgress
} from '@mui/material';
import {
    AddShoppingCart as AddShoppingCartIcon,
    ReceiptLong as ReceiptIcon
} from '@mui/icons-material';

import { getSales } from '../../services/saleService';

const SalesPage = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data } = await getSales();
                setSales(data.sales || []);
            } catch (error) {
                console.error("Error loading sales:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Sales History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View transactions and revenue
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => navigate('/sales/create')}
                    sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                >
                    New Sale (POS)
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                {loading && <LinearProgress />}
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Invoice #</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sold By</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Items</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loading && sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                        <ReceiptIcon sx={{ fontSize: 60, mb: 1 }} />
                                        <Typography>No sales recorded yet</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale._id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {sale.invoiceNumber}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(sale.createdAt).toLocaleDateString()} {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        {sale.customer?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        {sale.user?.firstName} {sale.user?.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${sale.items.reduce((sum, item) => sum + item.quantity, 0)} units`}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                        ${sale.total?.toFixed(2)}
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

export default SalesPage;