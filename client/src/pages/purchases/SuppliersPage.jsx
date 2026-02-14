import { useEffect, useState } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import { 
    Add as AddIcon, 
    LocalShipping as TruckIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';

import { getSuppliers, createSupplier } from '../../services/supplierService';

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [open, setOpen] = useState(false);
    
    // Formulario
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

    const loadSuppliers = async () => {
        try {
            const { data } = await getSuppliers();
            setSuppliers(data.suppliers || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { loadSuppliers(); }, []);

    const handleSave = async () => {
        if (!formData.name) return alert("Name is required");
        try {
            await createSupplier(formData);
            setOpen(false);
            setFormData({ name: '', phone: '', email: '' }); // Limpiar
            loadSuppliers(); // Recargar lista
        } catch (error) {
            alert("Error creating supplier");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">Suppliers</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Supplier
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.map((s) => (
                            <TableRow key={s._id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TruckIcon color="action" /> {s.name}
                                    </Box>
                                </TableCell>
                                <TableCell><PhoneIcon fontSize="small" sx={{mr:1, verticalAlign:'middle'}}/>{s.phone || '-'}</TableCell>
                                <TableCell>{s.email || '-'}</TableCell>
                            </TableRow>
                        ))}
                        {suppliers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No suppliers found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de Creación Rápida */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Register New Supplier</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus margin="dense" label="Company Name" fullWidth 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <TextField 
                        margin="dense" label="Phone" fullWidth 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <TextField 
                        margin="dense" label="Email" fullWidth 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SuppliersPage;