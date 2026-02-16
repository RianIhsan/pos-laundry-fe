import React, { useEffect, useState } from 'react';
import { LayoutDashboard, PlusCircle, Receipt, Users, LogOut, Tag, Box, History} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import api from '../services/api';
import Swal from 'sweetalert2'; // Tambah Swal

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate(); // Inisialisasi navigate
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/me');
                setProfile(response.data.data);
            } catch (err) {
                console.error("Gagal ambil profil:", err);
            }
        };
        fetchProfile();
    }, []);

    // Fungsi Logout Baru dengan SweetAlert2 & useNavigate
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Keluar Sistem?',
            text: "Anda perlu login kembali untuk mengakses data.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            borderRadius: '1.5rem'
        });

        if (result.isConfirmed) {
            localStorage.clear(); // Bersihkan semua token
            navigate('/login'); // Navigasi via React Router (Anti 404 Vercel)

            // Opsional: Berikan toast sukses singkat
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
            Toast.fire({ icon: 'success', title: 'Berhasil logout' });
        }
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20}/>, label: "Dashboard", path: "/" },
        { icon: <PlusCircle size={20}/>, label: "Order Baru", path: "/new-order" },
        { icon: <Tag size={20}/>, label: "Layanan", path: "/services" },
        { icon: <Box size={20}/>, label: "Inventory", path: "/inventory" },
        { icon: <Receipt size={20}/>, label: "Transaksi", path: "/transactions" },
        { icon: <Users size={20}/>, label: "Pelanggan", path: "/customers" },
        { icon: <History size={20}/>, label: "Audit Log", path: "/audit-log" }
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between z-10">
                <div>
                    <div className="mb-10">
                        <h1 className="text-2xl font-black text-blue-600 tracking-tight">WASH EXPRESS</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">I wish you wash here</p>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {item.icon}
                                <span className="font-bold text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                                {profile?.name ? profile.name.charAt(0) : 'AD'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate w-24">
                                    {profile?.name || 'Loading...'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                    {profile?.role || 'Staff'}
                                </p>
                            </div>
                        </div>
                        {/* Panggil handleLogout di sini */}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC] relative">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;