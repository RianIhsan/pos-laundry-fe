import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CreateTransaction from './pages/CreateTransaction';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transaction.jsx'; // Perbaiki typo jika file-nya Transactions (plural)
import Customers from './pages/Customers.jsx';
import Login from './pages/Login.jsx';
import Services from "./pages/Services.jsx";
import Inventory from './pages/Inventory.jsx';
import AuditLog from './pages/AuditLog.jsx';

function App() {
    // Logic sederhana untuk cek login (nanti diganti dengan cek JWT di localStorage)
    const isAuthenticated = !!localStorage.getItem('access_token');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/new-order" element={<CreateTransaction />} />
                                    <Route path="/transactions" element={<Transactions />} />
                                    <Route path="/inventory" element={<Inventory />} />
                                    <Route path="/customers" element={<Customers />} />
                                    <Route path="/services" element={<Services />} />
                                    <Route path="/audit-log" element={<AuditLog />} />

                                    {/* Jika user mengakses path yang salah, lempar ke dashboard */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Layout>
                        ) : (
                            // Jika belum login, paksa ke halaman login
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;