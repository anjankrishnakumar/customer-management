import LoginPage from './Login';
import CustomersPage from './CustomersPage';
import RegisterPage from './RegisterPage';
import ErrorPage from './ErrorPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )

}

export default App
