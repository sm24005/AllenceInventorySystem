import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginUserPage from './pages/users/LoginUserPage';
import ProductsPage from './pages/products/ProductsPage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProductPage from './pages/products/EditProductPage';
import CustomersPage from './pages/customers/CustomersPage';
import CreateCustomerPage from './pages/customers/CreateCustomerPage';
import EditCustomerPage from './pages/customers/EditCustomerPage';

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
                {/* Productos */}
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<CreateProductPage />} />
                <Route path="products/edit/:id" element={<EditProductPage />} />

                {/* Clientes */}
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/create" element={<CreateCustomerPage />} />
                <Route path="customers/edit/:id" element={<EditCustomerPage />} />
            </Route>
        </Route>
        
        {/* Ruta por defecto para 404 */}
        <Route path="*" element={<LoginUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;