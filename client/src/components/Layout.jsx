import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, 
    Typography, Avatar, Menu, MenuItem 
} from '@mui/material';
import { 
    Menu as MenuIcon, 
    Dashboard as DashboardIcon, 
    Inventory as ProductIcon, 
    People as CustomerIcon, 
    ShoppingCart as SaleIcon,
    LocalShipping as SupplierIcon, 
    Receipt as PurchaseIcon,
    Group as UserIcon,
    Logout as LogoutIcon,
    Category as CategoryIcon,
    Label as BrandIcon,
    RemoveShoppingCart as ReturnIcon
} from '@mui/icons-material';

import { logout, getAuthUser } from '../utils/auth';

const drawerWidth = 240;

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getAuthUser();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate('/users/login');
    };

    // Permisos
    const isAdmin = user?.role === 'ADMIN';
    const isManager = ['ADMIN', 'MANAGER'].includes(user?.role);

    const drawer = (
        <div>
            <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                    ALLENCE ERP
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {/* DASHBOARD */}
                <ListItem disablePadding>
                    <ListItemButton selected={location.pathname === '/'} onClick={() => navigate('/')}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                {/* VENTAS (Todos) */}
                <ListItem disablePadding>
                    <ListItemButton selected={location.pathname.includes('/sales')} onClick={() => navigate('/sales')}>
                        <ListItemIcon><SaleIcon /></ListItemIcon>
                        <ListItemText primary="Sales" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton selected={location.pathname.includes('/returns')} onClick={() => navigate('/returns')}>
                        <ListItemIcon><ReturnIcon /></ListItemIcon>
                        <ListItemText primary="Returns" />
                    </ListItemButton>
                </ListItem>

                {/* CLIENTES (Todos) */}
                <ListItem disablePadding>
                    <ListItemButton selected={location.pathname.includes('/customers')} onClick={() => navigate('/customers')}>
                        <ListItemIcon><CustomerIcon /></ListItemIcon>
                        <ListItemText primary="Customers" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                {/* --- SECCIÓN DE INVENTARIO (Manager/Admin) --- */}
                {isManager && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname === '/products'} onClick={() => navigate('/products')}>
                                <ListItemIcon><ProductIcon /></ListItemIcon>
                                <ListItemText primary="Products" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname.includes('/purchases')} onClick={() => navigate('/purchases')}>
                                <ListItemIcon><PurchaseIcon /></ListItemIcon>
                                <ListItemText primary="Purchases" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname.includes('/suppliers')} onClick={() => navigate('/suppliers')}>
                                <ListItemIcon><SupplierIcon /></ListItemIcon>
                                <ListItemText primary="Suppliers" />
                            </ListItemButton>
                        </ListItem>
                        
                        {/* --- NUEVOS BOTONES DE CONFIGURACIÓN --- */}
                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname.includes('/categories')} onClick={() => navigate('/categories')}>
                                <ListItemIcon><CategoryIcon /></ListItemIcon>
                                <ListItemText primary="Categories" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton selected={location.pathname.includes('/brands')} onClick={() => navigate('/brands')}>
                                <ListItemIcon><BrandIcon /></ListItemIcon>
                                <ListItemText primary="Brands" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}

                <Divider sx={{ my: 1 }} />

                {/* USUARIOS (Solo Admin) */}
                {isAdmin && (
                    <ListItem disablePadding>
                        <ListItemButton selected={location.pathname.includes('/users')} onClick={() => navigate('/users')}>
                            <ListItemIcon><UserIcon /></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {user ? `Hello, ${user.firstName}` : 'Inventory System'}
                    </Typography>
                    <div>
                        <IconButton size="large" onClick={handleMenu} color="inherit">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                {user?.firstName?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
                    {drawer}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }} open>
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;