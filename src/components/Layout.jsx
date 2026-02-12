import React from 'react';
import { LayoutDashboard, Receipt, Users, Settings, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20}/>, label: "Dashboard", path: "/" },
        { icon: <PlusCircle size={20}/>, label: "Order Baru", path: "/new-order" },
        { icon: <Receipt size={20}/>, label: "Transaksi", path: "/transactions" },
        { icon: <Users size={20}/>, label: "Pelanggan", path: "/customers" },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                <div className="mb-10">
                    <h1 className="text-2xl font-black text-blue-600 tracking-tight">LAUNDRY.PRO</h1>
                    <p className="text-xs text-slate-400 font-medium">Production Grade POS</p>
                </div>

                <nav className="space-y-1 flex-1">
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
                            <span className="font-semibold">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Admin Kasir</p>
                            <p className="text-xs text-slate-500">Cabang Pusat</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;