require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const { createAdmin } = require('./libs/initialSetup');

const productsRoutes = require('./routes/productsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const customersRoutes = require('./routes/customersRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
  res.send('¡API de Allence funcionando perfectamente!');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    createAdmin(); 
    
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});