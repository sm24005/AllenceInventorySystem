import { useEffect, useState } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Dialog, 
    DialogTitle, DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Category as CatIcon } from '@mui/icons-material';

import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            const { data } = await getCategories();
            setCategories(data.categories || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async () => {
        if (!name.trim()) return;
        try {
            await createCategory({ name });
            setName('');
            setOpen(false);
            loadData();
        } catch (err) {
            setError('Error creating category (maybe duplicate?)');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            await deleteCategory(id);
            loadData();
        }
    };

    return (
        <Box maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">Categories</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Category
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((c) => (
                            <TableRow key={c._id}>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CatIcon color="action" fontSize="small"/> {c.name}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton color="error" onClick={() => handleDelete(c._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Category</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField 
                        autoFocus margin="dense" label="Category Name" fullWidth 
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

export default CategoriesPage;