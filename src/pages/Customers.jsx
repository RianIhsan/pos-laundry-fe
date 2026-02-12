import React, { useState } from 'react';
import { Search, UserPlus, Phone, MapPin, History, Edit2, Trash2, Star } from 'lucide-react';

const Customers = () => {
    // Data dummy untuk integrasi API GET /customers
    const [customers] = useState([
        { id: 1, name: 'Andi Herlambang', phone: '08123456789', address: 'Jl. Merdeka No. 10', joinDate: '10 Jan 2026', totalOrders: 15, points: 150 },
        { id: 2, name: 'Siti Aminah', phone: '08571234567', address: 'Gang Kelinci No. 4', joinDate: '15 Jan 2026', totalOrders: 8, points: 80 },
        { id: 3, name: 'Budi Santoso', phone: '08998765432', address: 'Apartemen Green View A/12', joinDate: '02 Feb 2026', totalOrders: 3, points: 30 },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Database Pelanggan</h2>
                    <p className="text-slate-500 font-medium text-sm">Kelola data member dan pantau loyalitas pelanggan.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                    <UserPlus size={18} /> Tambah Member
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama, nomor telepon, atau alamat..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                />
            </div>

            {/* CUSTOMER GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div key={customer.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                                {customer.name.charAt(0)}
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h4 className="font-black text-slate-800 text-lg leading-tight">{customer.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Member sejak {customer.joinDate}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-sm font-medium">{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin size={16} className="text-slate-400" />
                                <span className="text-sm font-medium truncate">{customer.address}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Order</p>
                                <p className="text-lg font-black text-slate-800">{customer.totalOrders} <span className="text-xs font-normal text-slate-500">Kali</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Poin Member</p>
                                <p className="text-lg font-black text-amber-500 flex items-center gap-1">
                                    <Star size={16} fill="currentColor" /> {customer.points}
                                </p>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                            <History size={14} /> Lihat Riwayat Cuci
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;