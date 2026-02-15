import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { RemoveShoppingCart as ReturnIcon, Add as AddIcon } from '@mui/icons-material';

import { getReturns } from '../../services/returnService';

const ReturnsPage = () => {
    const navigate = useNavigate();
    const [returns, setReturns] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await getReturns();
                setReturns(data.returns || []);
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="error" fontWeight="bold">Returns & Refunds</Typography>
                <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => navigate('/returns/create')}>
                    Process Return
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#d32f2f' }}> {/* Rojo para devoluciones */}
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white' }}>Invoice #</TableCell>
                            <TableCell sx={{ color: 'white' }}>Processed By</TableCell>
                            <TableCell sx={{ color: 'white' }}>Items Returned</TableCell>
                            <TableCell sx={{ color: 'white' }}>Condition</TableCell>
                            <TableCell sx={{ color: 'white', textAlign: 'right' }}>Refunded</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {returns.map((r) => (
                            <TableRow key={r._id}>
                                <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace' }}>{r.invoiceNumber}</TableCell>
                                <TableCell>{r.user?.firstName} {r.user?.lastName}</TableCell>
                                <TableCell>{r.items.length}</TableCell>
                                <TableCell>
                                    {r.items.map((i, idx) => (
                                        <Chip 
                                            key={idx} 
                                            label={i.condition} 
                                            size="small" 
                                            color={i.condition === 'Good' ? 'success' : 'default'} 
                                            variant="outlined"
                                            sx={{ mr: 0.5 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                    -${r.totalRefund?.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {returns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No returns recorded.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ReturnsPage;