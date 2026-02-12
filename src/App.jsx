import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CreateTransaction from './pages/CreateTransaction';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transaction.jsx'; // Perbaiki typo jika file-nya Transactions (plural)
import Customers from './pages/Customers.jsx';
import Login from './pages/Login.jsx';

function App() {
    // Logic sederhana untuk cek login (nanti diganti dengan cek JWT di localStorage)
    const isAuthenticated = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Route Public: Login tidak menggunakan Layout */}
                <Route path="/login" element={<Login />} />

                {/* 2. Route Private: Dibungkus dengan Layout */}
                {/* Kita gunakan path "/*" agar rute di dalamnya tetap konsisten */}
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/new-order" element={<CreateTransaction />} />
                                    <Route path="/transactions" element={<Transactions />} />
                                    <Route path="/customers" element={<Customers />} />

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