require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const seedUsers = require('./utils/seeder');

const usersRoutes = require('./routes/usersRoutes');
const productsRoutes = require('./routes/productsRoutes');
const customerRoutes = require('./routes/customerRoutes');
const salesRoutes = require('./routes/salesRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const supplierRoutes = require('./routes/supplierRoutes');
// const brandRoutes = require('./routes/brandRoutes');
// const purchaseRoutes = require('./routes/purchaseRoutes');
// const returnRoutes = require('./routes/returnRoutes');

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/brands', brandRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/returns', returnRoutes);

app.get('/', (req, res) => {
  res.send('¡API de Allence funcionando perfectamente!');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    seedUsers(); 
    
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});