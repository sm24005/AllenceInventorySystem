import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, IconButton, Button, CssBaseline, Divider, Avatar
} from '@mui/material';
import { 
  Inventory, People, Badge, Home as HomeIcon, 
  Logout, Menu as MenuIcon, ShoppingCart, LocalShipping
} from '@mui/icons-material';

import { getAuthUser } from '../utils/auth';

const drawerWidth = 260;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/users/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // TRADUCCIÓN DE ENLACES
  const links = [
    { to: "/", label: "Home", icon: <HomeIcon />, roles: ['ADMIN', 'MANAGER', 'SELLER'] },
    { to: "/products", label: "Inventory", icon: <Inventory />, roles: ['ADMIN', 'MANAGER', 'SELLER'] },
    { to: "/customers", label: "Customers", icon: <People />, roles: ['ADMIN', 'SELLER'] },
    { to: "/sales", label: "Sales", icon: <ShoppingCart />, roles: ['ADMIN', 'MANAGER', 'SELLER'] },
    { to: "/purchases", label: "Purchases", icon: <LocalShipping />, roles: ['ADMIN', 'MANAGER'] },
    { to: "/users", label: "Users", icon: <Badge />, roles: ['ADMIN'] },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Avatar sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }}>
            {user?.firstName?.charAt(0) || 'U'}
        </Avatar>
        <Box>
            <Typography variant="subtitle2" fontWeight="bold">
                {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                {user?.role}
            </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, p: 2 }}>
        {links
          .filter(link => !link.roles || link.roles.includes(user?.role))
          .map((link) => (
            <ListItem key={link.to} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to={link.to}
                selected={location.pathname === link.to}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.main' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: location.pathname === link.to ? 'inherit' : 'text.secondary' }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<Logout />} 
            onClick={handleLogout}
        >
            Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />
      
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Allence <span style={{ color: '#555', fontWeight: 'normal' }}>Dashboard</span>
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth, 
                borderRight: 'none',
                boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;