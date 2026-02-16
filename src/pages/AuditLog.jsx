import React, { useEffect, useState } from 'react';
import { History, User, Activity, Box, Receipt, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await dashboardService.getActivityLogs(page);
            setLogs(response.data.data.items);
            setPagination({
                page: response.data.data.page,
                total_pages: response.data.data.total_pages
            });
        } catch (err) {
            console.error("Gagal load audit log", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Helper untuk styling Badge berdasarkan tipe target
    const getTargetBadge = (type) => {
        switch (type) {
            case 'TRANSACTION':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'INVENTORY':
                return 'bg-purple-50 text-purple-600 border-purple-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Audit Log</h2>
                    <p className="text-slate-500 font-medium text-sm">Rekam jejak seluruh aktivitas pengguna dalam sistem.</p>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                        <th className="px-8 py-5">Waktu</th>
                        <th className="px-8 py-5">Pengguna</th>
                        <th className="px-8 py-5">Aksi</th>
                        <th className="px-8 py-5">Target</th>
                        <th className="px-8 py-5">Deskripsi</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="py-20 text-center">
                                <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                                <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Memuat Log...</p>
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-8 py-5">
                                    <p className="font-bold text-slate-700">
                                        {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                                        {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                            <User size={14} />
                                        </div>
                                        <span className="font-black text-slate-800">{log.user_name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 font-bold text-slate-600">
                                    {log.action}
                                </td>
                                <td className="px-8 py-5">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${getTargetBadge(log.target_type)}`}>
                                        {log.target_type === 'TRANSACTION' ? <Receipt size={12} /> : <Box size={12} />}
                                        {log.target}
                                    </div>
                                </td>
                                <td className="px-8 py-5 italic text-slate-400 text-xs">
                                    {log.description || '-'}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                {/* PAGINATION SIMPLE */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Halaman {pagination.page} dari {pagination.total_pages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchLogs(pagination.page - 1)}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-blue-600 transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            disabled={pagination.page === pagination.total_pages}
                            onClick={() => fetchLogs(pagination.page + 1)}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-blue-600 transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;