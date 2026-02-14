import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, TextField, 
    InputAdornment, LinearProgress, Chip
} from '@mui/material';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Search as SearchIcon,
    PersonOff as PersonOffIcon
} from '@mui/icons-material';

import { getCustomers, deleteCustomer } from '../../services/customerService';
import { getAuthUser } from '../../utils/auth';

const CustomersPage = () => {
    const navigate = useNavigate();
    const user = getAuthUser();
    
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Permisos: Admin/Manager borran, Seller solo crea/edita
    const canEdit = ['ADMIN', 'MANAGER', 'SELLER'].includes(user?.role);
    const canDelete = ['ADMIN', 'MANAGER'].includes(user?.role);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data } = await getCustomers({ name: searchTerm });
            setCustomers(data.customers || []);
        } catch (error) {
            console.error("Error loading customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                fetchCustomers();
            } catch (error) {
                alert('Error deleting customer');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Customers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your client portfolio
                    </Typography>
                </Box>
                {canEdit && (
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/customers/create')}
                    >
                        New Customer
                    </Button>
                )}
            </Box>

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
                    onKeyPress={(e) => e.key === 'Enter' && fetchCustomers()}
                />
                <Button variant="outlined" onClick={fetchCustomers}>
                    Search
                </Button>
            </Paper>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                {loading && <LinearProgress />}
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>National ID (DUI)</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact Info</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loading && customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                        <PersonOffIcon sx={{ fontSize: 60, mb: 1 }} />
                                        <Typography>No customers found</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer._id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {customer.nationalId}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{customer.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {customer.email && (
                                                <Typography variant="caption" display="block">
                                                    📧 {customer.email}
                                                </Typography>
                                            )}
                                            {customer.phone && (
                                                <Typography variant="caption" display="block">
                                                    📞 {customer.phone}
                                                </Typography>
                                            )}
                                            {!customer.email && !customer.phone && <span style={{color:'#ccc'}}>-</span>}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        <Typography variant="caption" noWrap display="block">
                                            {customer.address || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {canEdit && (
                                            <IconButton color="primary" size="small" onClick={() => navigate(`/customers/edit/${customer._id}`)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {canDelete && (
                                            <IconButton color="error" size="small" onClick={() => handleDelete(customer._id)}>
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

export default CustomersPage;