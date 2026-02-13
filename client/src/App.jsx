import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginUserPage from './pages/users/LoginUserPage';
import ProtectedRoute from './components/ProtectedRoute';

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
                {/* Aquí iremos agregando ProductsPage, CustomersPage, etc. */}
            </Route>
        </Route>
        
        {/* Ruta por defecto para 404 */}
        <Route path="*" element={<LoginUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;