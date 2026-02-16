import React, { useEffect, useState } from 'react';
import {
    Search, Filter, Printer, Eye, MoreVertical, CheckCircle2,
    Clock, Package, MessageSquare, X, Smartphone, MapPin, Loader2, RefreshCcw, Banknote
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import Swal from 'sweetalert2'; // Added SweetAlert2

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrx, setSelectedTrx] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // --- State for On-Site Payment ---
    const [showPaymentInput, setShowPaymentInput] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);

    // Custom Toast for small notifications
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await transactionService.getAll();
            setTransactions(response.data.data);
        } catch (err) {
            console.error("Gagal load transaksi:", err);
            Toast.fire({
                icon: 'error',
                title: 'Gagal memuat data transaksi'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleUpdateStatus = async (newOrderStatus, newPaymentStatus) => {
        // Check if moving to COMPLETED but still UNPAID
        if (newOrderStatus === 'COMPLETED' && selectedTrx.payment_status === 'UNPAID' && !showPaymentInput) {
            setShowPaymentInput(true);
            return;
        }

        setIsUpdating(true);
        try {
            const payload = {
                order_status: newOrderStatus,
                // Automatically set to PAID if status is COMPLETED
                payment_status: newOrderStatus === 'COMPLETED' ? 'PAID' : (newPaymentStatus || selectedTrx.payment_status)
            };

            await transactionService.updateStatus(selectedTrx.id, payload);

            // Professional success notification
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `Nota ${selectedTrx.invoice_no} telah diperbarui menjadi ${newOrderStatus.replace(/_/g, ' ')}.`,
                confirmButtonColor: '#10b981',
                borderRadius: '1.5rem'
            });

            // Reset & Refresh
            setShowPaymentInput(false);
            setPaymentAmount(0);
            await fetchTransactions();
            setSelectedTrx(null);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: err.response?.data?.message || "Terjadi kesalahan saat memperbarui status.",
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'WASHING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'READY_TO_PICKUP': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const filteredTransactions = transactions.filter(trx =>
        trx.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const change = paymentAmount - (selectedTrx?.total_price || 0);

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center opacity-50">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
            <p className="font-bold text-slate-500 text-sm italic">Menarik data dari server...</p>
        </div>
    );

    return (
        <div className="relative">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Transaksi</h2>
                        <p className="text-slate-500 font-medium text-sm">Kelola proses produksi dan pelunasan nota.</p>
                    </div>
                    <button onClick={fetchTransactions} className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                        <RefreshCcw size={18} /> Refresh
                    </button>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari No. Invoice atau Nama Pelanggan..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                            <th className="px-8 py-5">Invoice</th>
                            <th className="px-8 py-5">Pelanggan</th>
                            <th className="px-8 py-5 text-center">Status</th>
                            <th className="px-8 py-5 text-right">Total</th>
                            <th className="px-8 py-5 text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {filteredTransactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                                <td className="px-8 py-6">
                                    <span className="font-black text-blue-600 tracking-wider">{trx.invoice_no}</span>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                                        {new Date(trx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-slate-800 text-base">{trx.customer_name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">By: {trx.user_name}</p>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(trx.order_status)}`}>
                                        {trx.order_status === 'WASHING' && <Clock size={12} />}
                                        {trx.order_status === 'READY_TO_PICKUP' && <Package size={12} />}
                                        {trx.order_status === 'COMPLETED' && <CheckCircle2 size={12} />}
                                        {trx.order_status.replace(/_/g, ' ')}
                                    </div>
                                    <p className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${trx.payment_status === 'PAID' ? 'text-emerald-500' : 'text-red-400 animate-pulse'}`}>
                                        {trx.payment_status}
                                    </p>
                                </td>
                                <td className="px-8 py-6 text-right font-black text-slate-900 text-lg">
                                    Rp {trx.total_price.toLocaleString()}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <button
                                        onClick={() => { setSelectedTrx(trx); setShowPaymentInput(false); }}
                                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition shadow-sm"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DETAIL & RECONCILIATION */}
            {selectedTrx && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200 max-h-[90vh]">

                        {/* LEFT PANEL: Info & Update Status */}
                        <div className="w-full md:w-5/12 bg-slate-50 p-8 overflow-y-auto border-r border-slate-100 flex flex-col">
                            <div className="mb-8 flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-[0.2em]">Manajemen Order</span>
                                    <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{selectedTrx.invoice_no}</h3>
                                </div>
                                <div className="md:hidden">
                                    <button onClick={() => setSelectedTrx(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Kontak Pelanggan</p>
                                    <div className="flex items-center gap-3 text-slate-800 font-bold text-sm">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Smartphone size={16}/></div>
                                        {selectedTrx.customer_name} (ID: #{selectedTrx.customer_id})
                                    </div>
                                </div>

                                <div className="px-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ganti Status Produksi</p>

                                    {/* --- PAYMENT INPUT LOGIC --- */}
                                    {showPaymentInput ? (
                                        <div className="space-y-4 bg-white p-6 rounded-[2rem] border-2 border-emerald-500 shadow-xl shadow-emerald-50 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">💰 Pelunasan Tunai</p>
                                                <button onClick={() => setShowPaymentInput(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16}/></button>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Uang Diterima</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">Rp</span>
                                                    <input
                                                        type="number"
                                                        autoFocus
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-2xl font-black outline-none focus:ring-2 focus:ring-emerald-500 tracking-tighter"
                                                        placeholder="0"
                                                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center">
                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Kembalian</span>
                                                <span className={`text-xl font-black ${change < 0 ? 'text-red-500' : 'text-emerald-700'}`}>
                                                    Rp {change < 0 ? 0 : change.toLocaleString()}
                                                </span>
                                            </div>

                                            <button
                                                disabled={paymentAmount < selectedTrx.total_price || isUpdating}
                                                onClick={() => handleUpdateStatus('COMPLETED')}
                                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "Ambil & Lunaskan"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2">
                                            <button
                                                disabled={isUpdating}
                                                onClick={() => handleUpdateStatus('WASHING')}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 font-black text-[10px] tracking-widest transition ${selectedTrx.order_status === 'WASHING' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                WASHING (DICUCI)
                                                {isUpdating && <Loader2 size={14} className="animate-spin" />}
                                            </button>
                                            <button
                                                disabled={isUpdating}
                                                onClick={() => handleUpdateStatus('READY_TO_PICKUP')}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 font-black text-[10px] tracking-widest transition ${selectedTrx.order_status === 'READY_TO_PICKUP' ? 'border-amber-600 bg-amber-50 text-amber-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                READY TO PICKUP (SIAP)
                                            </button>
                                            <button
                                                disabled={isUpdating}
                                                onClick={() => handleUpdateStatus('COMPLETED')}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 font-black text-[10px] tracking-widest transition-all ${selectedTrx.order_status === 'COMPLETED' ? 'border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'}`}
                                            >
                                                COMPLETED (DIAMBIL)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Billing Details */}
                        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between overflow-y-auto bg-white relative">
                            <div className="hidden md:block absolute top-6 right-6">
                                <button onClick={() => setSelectedTrx(null)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-300 hover:text-slate-600"><X size={28} /></button>
                            </div>

                            <div>
                                <h4 className="font-black text-slate-800 text-xl tracking-tight mb-8">Rincian Item</h4>
                                <div className="space-y-4">
                                    {selectedTrx.items?.map((item, idx) => (
                                        <div key={idx} className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-slate-800 text-base leading-tight">{item.service_name}</p>
                                                    <p className="text-xs text-slate-500 font-bold mt-1 tracking-tight">
                                                        {item.qty} unit x Rp {item.price_at_time.toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className="font-black text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm text-sm">
                                                    Rp {item.subtotal.toLocaleString()}
                                                </span>
                                            </div>
                                            {item.note && (
                                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-700 bg-amber-100/40 px-3 py-2 rounded-xl w-fit leading-none">
                                                    <MessageSquare size={12} /> {item.note}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 border-t-2 border-dashed border-slate-100 pt-6 space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <div className="space-y-1">
                                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Metode Pembayaran</p>
                                        <div className="flex items-center gap-2">
                                            <Banknote size={16} className="text-slate-400" />
                                            <p className="font-black text-slate-800 text-sm">{selectedTrx.payment_method} - <span className={selectedTrx.payment_status === 'PAID' ? 'text-emerald-500' : 'text-red-500'}>{selectedTrx.payment_status}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Tagihan</p>
                                        <p className="text-4xl font-black text-blue-600 tracking-tighter">Rp {selectedTrx.total_price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-100">
                                        <Printer size={16} /> Cetak Struk
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.15em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
                                        WhatsApp Nota
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;