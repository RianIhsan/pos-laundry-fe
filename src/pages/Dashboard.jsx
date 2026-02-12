import React from 'react';
import {
    TrendingUp,
    Users,
    Package,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2
} from 'lucide-react';

const Dashboard = () => {
    // Data Dummy untuk Kontrak API BE nanti
    const stats = [
        { label: "Total Omzet", value: "Rp 8.450.000", trend: "+12.5%", positive: true, icon: <TrendingUp className="text-emerald-600" />, bg: "bg-emerald-50" },
        { label: "Pelanggan Baru", value: "128", trend: "+18%", positive: true, icon: <Users className="text-blue-600" />, bg: "bg-blue-50" },
        { label: "Pesanan Aktif", value: "42", trend: "Sedang Proses", positive: null, icon: <Clock className="text-amber-600" />, bg: "bg-amber-50" },
        { label: "Selesai Hari Ini", value: "15", trend: "-2%", positive: false, icon: <CheckCircle2 className="text-purple-600" />, bg: "bg-purple-50" },
    ];

    const ongoingOrders = [
        { id: 'TRX-9901', customer: 'Rizky Amalia', service: 'Cuci Setrika', qty: '5.2 kg', status: 'WASHING', color: 'text-blue-600 bg-blue-50' },
        { id: 'TRX-9902', customer: 'Fahri Hamzah', service: 'Bedcover L', qty: '1 pcs', status: 'DRYING', color: 'text-amber-600 bg-amber-50' },
        { id: 'TRX-9903', customer: 'Sarah Wijaya', service: 'Jas Pria', qty: '2 pcs', status: 'READY', color: 'text-emerald-600 bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER SECTION */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Ringkasan Bisnis</h2>
                    <p className="text-slate-500 font-medium">Kamis, 12 Februari 2026</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                        Unduh Laporan
                    </button>
                    <button className="px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${s.bg}`}>{s.icon}</div>
                            {s.positive !== null && (
                                <span className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg ${s.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {s.positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {s.trend}
                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
                        <h3 className="text-2xl font-black text-slate-900">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-12 gap-8">

                {/* LEFT: MONITORING PRODUCTION */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Package size={20} className="text-blue-600" /> Antrean Produksi Aktif
                            </h3>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">3 Perlu Perhatian</span>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {ongoingOrders.map((order, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-slate-800">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-700">{order.customer}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{order.service} • {order.qty}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${order.color}`}>
                          {order.status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 font-bold text-xs hover:underline">Update Status</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT: NOTIFICATIONS & INVENTORY */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <AlertCircle size={20} className="text-red-500" /> Peringatan Stok
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                    <span className="text-slate-600">Deterjen Liquid</span>
                                    <span className="text-red-500">1.5 Liter Sisa</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[15%]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                    <span className="text-slate-600">Pewangi Sakura</span>
                                    <span className="text-blue-500">8.0 Liter Sisa</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[80%]"></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">
                            Beli Bahan Baku
                        </button>
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
                        <h3 className="font-bold mb-2">Tips Hari Ini</h3>
                        <p className="text-xs text-indigo-100 leading-relaxed italic">
                            "Gunakan deterjen anti-bakteri untuk pesanan ekspress agar menjaga kepuasan pelanggan tetap tinggi."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;