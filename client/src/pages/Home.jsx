import { Box, Typography, Paper, Grid } from '@mui/material';
import { getAuthUser } from '../utils/auth';

const Home = () => {
    const user = getAuthUser();

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Hello, {user?.firstName || 'User'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Welcome to the Allence Management System.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Quick Access</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Select an option from the sidebar menu to get started.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;