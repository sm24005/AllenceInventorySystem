import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginUserPage from './pages/users/LoginUserPage';
import ProtectedRoute from './components/ProtectedRoute';

// Productos
import ProductsPage from './pages/products/ProductsPage';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProductPage from './pages/products/EditProductPage';

// Clientes
import CustomersPage from './pages/customers/CustomersPage';
import CreateCustomerPage from './pages/customers/CreateCustomerPage';
import EditCustomerPage from './pages/customers/EditCustomerPage';

// Ventas
import SalesPage from './pages/sales/SalesPage';
import CreateSalePage from './pages/sales/CreateSalePage';

// Usuarios
import UsersPage from './pages/users/UsersPage';
import CreateUserPage from './pages/users/CreateUserPage';
import EditUserPage from './pages/users/EditUserPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/users/login" element={<LoginUserPage />} />

        {/* Rutas Privadas: Protegidas por Layout y ProtectedRoute */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SELLER']} />}>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                
                {/* --- PRODUCTOS --- */}
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<CreateProductPage />} />
                <Route path="products/edit/:id" element={<EditProductPage />} />

                {/* --- CLIENTES --- */}
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/create" element={<CreateCustomerPage />} />
                <Route path="customers/edit/:id" element={<EditCustomerPage />} />

                {/* --- VENTAS --- */}
                <Route path="sales" element={<SalesPage />} />
                <Route path="sales/create" element={<CreateSalePage />} />

                {/* --- USUARIOS (Solo Admin y Manager) --- */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
                    <Route path="users" element={<UsersPage />} />
                    <Route path="users/create" element={<CreateUserPage />} />
                    <Route path="users/edit/:id" element={<EditUserPage />} />
                </Route>
                

            </Route>
        </Route>
        
        {/* Ruta por defecto para 404 */}
        <Route path="*" element={<LoginUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;