import { useEffect, useState } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Dialog, 
    DialogTitle, DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Label as TagIcon } from '@mui/icons-material';

import { getBrands, createBrand, deleteBrand } from '../../services/brandService';

const BrandsPage = () => {
    const [brands, setBrands] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            const { data } = await getBrands();
            setBrands(data.brands || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async () => {
        if (!name.trim()) return;
        try {
            await createBrand({ name });
            setName('');
            setOpen(false);
            loadData();
        } catch (err) {
            setError('Error creating brand');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this brand?')) {
            await deleteBrand(id);
            loadData();
        }
    };

    return (
        <Box maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">Brands</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Brand
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brands.map((b) => (
                            <TableRow key={b._id}>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TagIcon color="action" fontSize="small"/> {b.name}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton color="error" onClick={() => handleDelete(b._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Brand</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField 
                        autoFocus margin="dense" label="Brand Name" fullWidth 
                        value={name} onChange={(e) => setName(e.target.value)}
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

export default BrandsPage;