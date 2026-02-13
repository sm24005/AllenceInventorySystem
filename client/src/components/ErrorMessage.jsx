import React from 'react';
import { Alert, AlertTitle, List, ListItem, ListItemText, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorMessage = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert 
      severity="error" 
      variant="filled"
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      sx={{ mb: 3, width: '100%', borderRadius: 2 }}
    >
      <AlertTitle sx={{ fontWeight: 'bold' }}>Error de Acceso</AlertTitle>
      <List dense sx={{ p: 0 }}>
        {errors.map((error, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText
              primary={
                <Typography variant="body2" color="white">
                   {error.mensaje}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

export default ErrorMessage;