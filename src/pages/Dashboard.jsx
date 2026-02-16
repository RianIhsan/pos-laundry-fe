import React, { useEffect, useState } from 'react';
import {
    TrendingUp, Users, Package, AlertCircle, ArrowUpRight, ArrowDownRight,
    Clock, CheckCircle2, Zap, ShoppingBag, MessageSquare, ChevronRight, RefreshCcw, Loader2
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resStats, resAct, resAlerts] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getActivities(),
                dashboardService.getInventoryAlerts()
            ]);
            setStats(resStats.data.data);
            // Batasi hanya 3 aktivitas terbaru agar tampilan proporsional
            setActivities(resAct.data.data.slice(0, 3));
            setAlerts(resAlerts.data.data);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center opacity-50">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
            <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Menyusun Dashboard...</p>
        </div>
    );

    const summaryCards = [
        { label: "Total Omzet", value: `Rp ${stats.summary.total_omzet.toLocaleString()}`, trend: stats.summary.omzet_trend, icon: <TrendingUp size={20} className="text-emerald-600" />, bg: "bg-emerald-50" },
        { label: "Member Baru", value: stats.summary.new_members, trend: stats.summary.member_trend, icon: <Users size={20} className="text-blue-600" />, bg: "bg-blue-50" },
        { label: "Proses Produksi", value: stats.summary.active_production, trend: "Pesanan", icon: <Zap size={20} className="text-amber-600" />, bg: "bg-amber-50" },
        { label: "Siap Ambil", value: stats.summary.ready_to_pickup_count, trend: `Tagihan: Rp ${stats.summary.unpaid_revenue.toLocaleString()}`, icon: <ShoppingBag size={20} className="text-purple-600" />, bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ringkasan Operasional</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Update Terakhir: {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition shadow-sm"><RefreshCcw size={20}/></button>
                    <button onClick={() => navigate('/transactions/create')} className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-2xl text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 uppercase tracking-tighter"><Package size={18} /> Order Baru</button>
                </div>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${s.bg}`}>{s.icon}</div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{s.value}</h3>
                                <p className="text-[10px] font-bold text-emerald-500 mt-0.5">{s.trend}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT: PRODUCTION QUEUE */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <Clock size={18} className="text-blue-600" /> Produksi Berjalan
                            </h3>
                            <button onClick={() => navigate('/transactions')} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">Detail</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Invoice & Pelanggan</th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {stats.production_queues.map((order, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-black text-slate-800 leading-none">{order.customer_name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{order.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-slate-600 truncate w-48">{order.service_name}</p>
                                            <p className="text-[10px] text-blue-500 font-black mt-0.5 uppercase">{order.qty_display}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                                <span className="px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 border border-blue-100">
                                                    {order.order_status}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* POPULAR SERVICES - Row Layout */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <CheckCircle2 size={18} className="text-emerald-500" /> Layanan Terpopuler
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.popular_services.map((service, i) => (
                                <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-800 truncate mb-1">{service.name}</p>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{service.total_orders} Order</p>
                                        <p className="text-xs font-black text-blue-600">Rp {service.total_revenue.toLocaleString()}</p>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${service.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTIVITY & STOCK ALERT */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Activity Feed - Cleaned Up */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest text-indigo-500">
                            <MessageSquare size={18} /> Aktivitas Kasir
                        </h3>
                        <div className="space-y-6 mb-6">
                            {activities.map((act, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== activities.length - 1 && <div className="absolute left-[9px] top-8 bottom-0 w-0.5 bg-slate-50"></div>}
                                    <div className="w-5 h-5 rounded-full bg-indigo-50 border-2 border-indigo-200 flex-shrink-0 z-10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-600 leading-snug">
                                            <span className="font-black text-slate-800">{act.user_name}</span> {act.action} <span className="font-black text-blue-600">{act.target}</span>
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{act.time_ago}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/audit-log')} className="w-full py-4 bg-slate-50 text-slate-400 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition flex items-center justify-center gap-2">
                            Lihat Audit Log <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Stock Alert - Simplified */}
                    <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black tracking-widest text-[10px] uppercase text-slate-400">Peringatan Stok</h3>
                            <AlertCircle size={18} className="text-red-400" />
                        </div>
                        <div className="space-y-5">
                            {alerts.slice(0, 3).map((alert, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase">
                                        <span className="text-slate-300 truncate w-32">{alert.item_name}</span>
                                        <span className={alert.status === 'WARNING' ? 'text-red-400' : 'text-emerald-400'}>{alert.stock_percentage}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${alert.status === 'WARNING' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} style={{ width: `${alert.stock_percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/inventory')} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-900/20">
                            Kelola Stok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;