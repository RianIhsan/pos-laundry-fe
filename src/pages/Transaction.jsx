import React, { useState } from 'react';
import {
    Search, Filter, Printer, Eye, MoreVertical, CheckCircle2,
    Clock, Package, MessageSquare, X, Smartphone, MapPin, Calendar
} from 'lucide-react';

const Transactions = () => {
    // State untuk mengontrol modal detail
    const [selectedTrx, setSelectedTrx] = useState(null);

    // Data dummy (nantinya berasal dari endpoint GET /transactions)
    const [transactions] = useState([
        {
            id: 'TRX-9901',
            customer: 'Rizky Amalia',
            phone: '08123456789',
            address: 'Jl. Melati No. 5, Jakarta',
            date: '12 Feb 2026',
            total: 36400,
            status: 'WASHING',
            payment: 'PAID',
            method: 'QRIS',
            items: [
                { name: 'Cuci Setrika Kiloan', qty: 5.2, unit: 'kg', price: 7000, note: 'Jangan pakai pewangi' }
            ],
            logs: [
                { time: '12 Feb 10:00', activity: 'Pesanan Diterima (Admin Kasir)' },
                { time: '12 Feb 10:30', activity: 'Masuk Proses Cuci (Mesin 02)' }
            ]
        },
        {
            id: 'TRX-9902',
            customer: 'Fahri Hamzah',
            phone: '08571234567',
            address: 'Kost Hijau Room 12',
            date: '12 Feb 2026',
            total: 35000,
            status: 'READY',
            payment: 'PAID',
            method: 'CASH',
            items: [
                { name: 'Bedcover L', qty: 1, unit: 'pcs', price: 35000, note: 'Noda kopi di pojok' }
            ],
            logs: [
                { time: '12 Feb 08:00', activity: 'Pesanan Diterima' },
                { time: '12 Feb 11:00', activity: 'Selesai Dikeringkan & Setrika' }
            ]
        },
        {
            id: 'TRX-9903',
            customer: 'Sarah Wijaya',
            phone: '08998877665',
            address: 'Perum Gading Serpong B/10',
            date: '11 Feb 2026',
            total: 90000,
            status: 'DONE',
            payment: 'PAID',
            method: 'CASH',
            items: [
                { name: 'Jas Pria', qty: 2, unit: 'pcs', price: 45000, note: 'Hanger plastik saja' }
            ],
            logs: [
                { time: '11 Feb 09:00', activity: 'Pesanan Diterima' },
                { time: '11 Feb 15:00', activity: 'Sudah Diambil Pelanggan' }
            ]
        },
    ]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'WASHING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'READY': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'DONE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="relative">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Transaksi</h2>
                        <p className="text-slate-500 font-medium text-sm">Pantau proses produksi dan status pembayaran pelanggan.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
                        <Printer size={18} /> Cetak Laporan
                    </button>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari No. Nota atau Nama Pelanggan..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3.5 rounded-2xl font-bold text-slate-600 hover:border-blue-500 transition shadow-sm">
                        <Filter size={20} /> Filter Status
                    </button>
                </div>

                {/* TRANSACTION TABLE */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                            <th className="px-8 py-5">No. Nota</th>
                            <th className="px-8 py-5">Pelanggan & Layanan</th>
                            <th className="px-8 py-5">Status Produksi</th>
                            <th className="px-8 py-5 text-right">Total Tagihan</th>
                            <th className="px-8 py-5 text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {transactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                                <td className="px-8 py-6">
                                    <span className="font-black text-blue-600 tracking-wider">{trx.id}</span>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{trx.date}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-slate-800 text-base">{trx.customer}</p>
                                    <div className="mt-1.5 space-y-1">
                                        {trx.items.map((item, idx) => (
                                            <div key={idx} className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-500">
                                                    {item.name} ({item.qty} {item.unit})
                                                </span>
                                                {item.note && (
                                                    <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                                        <MessageSquare size={10} /> {item.note}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(trx.status)}`}>
                                        {trx.status === 'WASHING' && <Clock size={12} />}
                                        {trx.status === 'READY' && <Package size={12} />}
                                        {trx.status === 'DONE' && <CheckCircle2 size={12} />}
                                        {trx.status}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1 uppercase">Metode: {trx.method}</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="font-black text-slate-900 text-lg">Rp {trx.total.toLocaleString()}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => setSelectedTrx(trx)}
                                            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition"
                                            title="Lihat Detail"
                                        >
                                            <Eye size={20} />
                                        </button>
                                        <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DETAIL TRANSAKSI */}
            {selectedTrx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200 max-h-[90vh]">

                        {/* KIRI: Info Pelanggan & Log */}
                        <div className="w-full md:w-5/12 bg-slate-50 p-8 overflow-y-auto border-r border-slate-100">
                            <div className="mb-8">
                                <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-[0.2em]">Nota Digital</span>
                                <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{selectedTrx.id}</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Informasi Pelanggan</p>
                                    <div className="flex items-center gap-3 text-slate-800 font-bold">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Smartphone size={16}/></div>
                                        {selectedTrx.phone}
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-600 text-sm">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-1"><MapPin size={16}/></div>
                                        {selectedTrx.address}
                                    </div>
                                </div>

                                <div className="px-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Log Perjalanan Baju</p>
                                    <div className="border-l-2 border-blue-100 ml-3 space-y-6">
                                        {selectedTrx.logs.map((log, i) => (
                                            <div key={i} className="relative pl-6">
                                                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm"></div>
                                                <p className="text-[10px] font-black text-slate-400">{log.time}</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5">{log.activity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KANAN: Detail Item & Billing */}
                        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between overflow-y-auto">
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="font-black text-slate-800 text-xl tracking-tight">Rincian Cucian</h4>
                                    <button onClick={() => setSelectedTrx(null)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {selectedTrx.items.map((item, idx) => (
                                        <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-slate-800">{item.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                                        {item.qty} {item.unit} x Rp {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className="font-black text-slate-900">
                                                    Rp {(item.qty * item.price).toLocaleString()}
                                                </span>
                                            </div>
                                            {item.note && (
                                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-700 bg-amber-100/50 px-3 py-1.5 rounded-lg w-fit">
                                                    <MessageSquare size={12} /> {item.note}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 border-t-2 border-dashed border-slate-100 pt-6 space-y-5">
                                <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Status Pembayaran</span>
                                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                                        <CheckCircle2 size={14}/> {selectedTrx.method} - LUNAS
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Total Bayar</span>
                                    <span className="text-3xl font-black text-blue-600 tracking-tighter">Rp {selectedTrx.total.toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition uppercase tracking-widest">
                                        <Printer size={16} /> Cetak Struk
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-100 uppercase tracking-widest">
                                        Kirim WhatsApp
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