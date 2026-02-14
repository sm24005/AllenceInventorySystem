import { useEffect, useState } from 'react';
import { 
    Grid, Paper, Typography, Box, CircularProgress, 
    Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Chip
} from '@mui/material';
import { 
    AttachMoney, Inventory, People, Warning, TrendingUp 
} from '@mui/icons-material';

import { getDashboardStats } from '../services/dashboardService';
import { getAuthUser } from '../utils/auth';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', borderLeft: `6px solid ${color}` }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography color="text.secondary" gutterBottom fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>
            </Box>
            <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: '50%', color: color }}>
                {icon}
            </Box>
        </CardContent>
    </Card>
);

const Home = () => {
    const user = getAuthUser();
    const [stats, setStats] = useState(null);
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getDashboardStats();
                setStats(data.stats);
                setRecentSales(data.recentSales);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back, <strong>{user?.firstName}</strong>! Here is what's happening today.
                </Typography>
            </Box>

            {/* Tarjetas de Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Revenue" 
                        value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} 
                        icon={<AttachMoney fontSize="large" />} 
                        color="#2e7d32" // Verde
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Sales Count" 
                        value={stats?.totalSalesCount || 0} 
                        icon={<TrendingUp fontSize="large" />} 
                        color="#1976d2" // Azul
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Customers" 
                        value={stats?.totalCustomers || 0} 
                        icon={<People fontSize="large" />} 
                        color="#ed6c02" // Naranja
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Low Stock Items" 
                        value={stats?.lowStockCount || 0} 
                        icon={<Warning fontSize="large" />} 
                        color="#d32f2f" // Rojo
                    />
                </Grid>
            </Grid>

            {/* Sección Inferior: Ventas Recientes */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Recent Transactions
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Invoice</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentSales.map((sale) => (
                                    <TableRow key={sale._id}>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>{sale.invoiceNumber}</TableCell>
                                        <TableCell>{sale.customer?.name || 'Guest'}</TableCell>
                                        <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                            ${sale.total?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {recentSales.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No recent sales.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%', bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Inventory Status
                        </Typography>
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Inventory sx={{ fontSize: 60, opacity: 0.8 }} />
                            <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                                {stats?.totalProducts || 0}
                            </Typography>
                            <Typography variant="subtitle1">Total Products</Typography>
                        </Box>
                        
                        <Box sx={{ mt: 4, bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2 }}>
                            <Typography variant="body2">
                                💡 Tip: Keep an eye on the "Low Stock" indicator to restock efficiently.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;