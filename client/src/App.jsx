import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginUserPage from './pages/users/LoginUserPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users/login" replace />} />
        <Route path="/users/login" element={<LoginUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;