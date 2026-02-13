import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Paper, 
  Avatar, CircularProgress, InputAdornment, Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import { loginUser } from '../../services/userService';
import { loginSchema } from '../../schemas/user';
import ErrorMessage from '../../components/ErrorMessage';

const LoginUserPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const resultado = loginSchema.safeParse(credentials);
      if (!resultado.success) {
        const listaErrores = resultado.error.issues.map(issue => ({
          campo: issue.path[0],
          mensaje: issue.message
        }));
        setErrors(listaErrores);
      } else {
        const response = await loginUser(credentials);
        localStorage.setItem('token', response.data.token);
        
        // Guardamos el usuario completo para tener el nombre disponible
        // El backend puede devolver 'user' o 'usuario' dependiendo de tu controller
        const userData = response.data.user || response.data.usuario;
        if (userData) {
             localStorage.setItem('user', JSON.stringify(userData));
        }
        
        navigate('/'); 
      }
    } catch (error) {
      console.log(error);
      let serverMessage = error.response?.data?.message || error.response?.data?.msg || 'Connection error';
      setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ width: '100%', bgcolor: 'white', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 60, height: 60 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" color="primary" fontWeight="bold">
              Allence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 4, width: '100%', bgcolor: '#fafafa' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2 }}>
              <ErrorMessage errors={errors} />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', boxShadow: 3 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
            </Button>
            
            <Typography variant="caption" display="block" align="center" color="text.disabled" sx={{ mt: 2 }}>
              © 2026 Allence Inventory System
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginUserPage;