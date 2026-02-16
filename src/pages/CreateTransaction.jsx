import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShoppingCart, X, Banknote, QrCode, Loader2, Clock } from 'lucide-react';
import { customerService } from '../services/customerService';
import { serviceService } from '../services/serviceService';
import { transactionService } from '../services/transactionService';
import Swal from 'sweetalert2'; // Import SweetAlert2

const CreateTransaction = () => {
    // --- STATES ---
    const [cart, setCart] = useState([]);
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('PAID');

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingServices, setIsFetchingServices] = useState(true);
    const [customer, setCustomer] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [customerResults, setCustomerResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Custom Toast Mixin
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    // --- FETCH KATALOG LAYANAN ---
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await serviceService.getAll();
                setServices(response.data.data);
            } catch (err) {
                console.error("Gagal mengambil katalog layanan", err);
            } finally {
                setIsFetchingServices(false);
            }
        };
        fetchServices();
    }, []);

    // --- LOGIC PENCARIAN PELANGGAN ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                try {
                    const response = await customerService.getAll();
                    const filtered = response.data.data.filter(c =>
                        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.phone.includes(searchTerm)
                    );
                    setCustomerResults(filtered);
                } catch (err) {
                    console.error("Gagal cari pelanggan", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setCustomerResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // --- LOGIC KERANJANG ---
    const addToCart = (service) => {
        const existing = cart.find(item => item.id === service.id);
        if (existing) {
            setCart(cart.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...service, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const change = amountPaid - total;

    // --- HANDLERS ---
    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await customerService.create(newCustomer);
            const savedCustomer = response.data.data;

            Toast.fire({
                icon: 'success',
                title: `Member ${savedCustomer.name} terdaftar!`
            });

            setIsModalOpen(false);
            setNewCustomer({ name: '', phone: '', address: '' });
            setCustomer(savedCustomer);
            setSearchTerm(savedCustomer.name);
        } catch (err) {
            Swal.fire('Gagal!', err.response?.data?.message || "Gagal daftar pelanggan", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishTransaction = async () => {
        if (!customer) {
            return Swal.fire({
                icon: 'warning',
                title: 'Pelanggan Belum Pilih',
                text: 'Harap pilih pelanggan terlebih dahulu!',
                confirmButtonColor: '#3b82f6'
            });
        }
        if (cart.length === 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Keranjang Kosong',
                text: 'Harap masukkan item cucian!',
                confirmButtonColor: '#3b82f6'
            });
        }

        setIsSubmitting(true);
        try {
            const payload = {
                customer_id: customer.id,
                total_price: total,
                payment_method: paymentMethod,
                payment_status: paymentStatus,
                amount_paid: paymentStatus === 'PAID' ? (paymentMethod === 'CASH' ? amountPaid : total) : 0,
                items: cart.map(item => ({
                    service_id: item.id,
                    qty: item.qty,
                    price_at_time: item.price,
                    note: item.note || ""
                }))
            };

            const response = await transactionService.create(payload);

            if (response.status === 201 || response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Transaksi Berhasil!',
                    html: `Invoice: <b>${response.data.data.invoice_no}</b>`,
                    confirmButtonColor: '#10b981',
                    borderRadius: '1.5rem'
                });

                setCart([]);
                setCustomer(null);
                setSearchTerm("");
                setIsPaymentModalOpen(false);
                setAmountPaid(0);
                setPaymentStatus('PAID');
            }
        } catch (err) {
            Swal.fire('Gagal!', err.response?.data?.message || "Gagal menyimpan transaksi", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWeightChange = (id, value) => {
        setCart(cart.map(item => item.id === id ? { ...item, qty: parseFloat(value) || 0 } : item));
    };

    const handleNoteChange = (id, note) => {
        setCart(cart.map(item => item.id === id ? { ...item, note: note } : item));
    };

    return (
        <div className="relative">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Order Baru</h2>
                    {customer && (
                        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Pelanggan: {customer.name}
                            <button onClick={() => { setCustomer(null); setSearchTerm(""); }} className="ml-2 hover:text-red-500"><X size={14}/></button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Sisi Kiri: Katalog */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <div className="relative">
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau nomor telepon..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-400" size={16} />}
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                                >
                                    <Plus size={18} /> Member Baru
                                </button>
                            </div>

                            {customerResults.length > 0 && (
                                <div className="absolute z-20 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                    {customerResults.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => { setCustomer(c); setCustomerResults([]); setSearchTerm(c.name); }}
                                            className="w-full p-4 text-left hover:bg-blue-50 flex justify-between items-center border-b last:border-none transition-colors"
                                        >
                                            <div>
                                                <p className="font-bold text-slate-800">{c.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{c.phone}</p>
                                            </div>
                                            <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-black uppercase tracking-tighter">Pilih</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {isFetchingServices ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {services.map((s) => (
                                    <button key={s.id} onClick={() => addToCart(s)} className="p-5 bg-white border border-slate-200 rounded-[1.5rem] text-left hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="text-blue-500" size={16} />
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md mb-3 inline-block uppercase tracking-wider ${s.category === 'Kiloan' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50'}`}>
                                            {s.category}
                                        </span>
                                        <p className="font-black text-slate-800 group-hover:text-blue-600 line-clamp-1 mb-1">{s.name}</p>
                                        <p className="text-sm text-slate-500 font-bold tracking-tight">Rp {s.price.toLocaleString()}/{s.unit}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sisi Kanan: Keranjang */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sticky top-6 shadow-sm">
                            <h3 className="font-black mb-6 flex items-center gap-2 text-slate-800 border-b pb-4 uppercase text-xs tracking-widest">
                                <ShoppingCart size={18} className="text-blue-600" /> Detail Keranjang
                            </h3>

                            <div className="space-y-4 min-h-[150px] max-h-[45vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="text-center py-12 flex flex-col items-center gap-2">
                                        <ShoppingCart size={24} className="text-slate-300" />
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Belum ada item</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-slate-800 leading-tight">{item.name}</p>
                                                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter mt-1">
                                                        Rp {item.price.toLocaleString()} / {item.unit}
                                                    </p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Qty ({item.unit})</label>
                                                    <input type="number" step="0.1" value={item.qty} onChange={(e) => handleWeightChange(item.id, e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                                                </div>
                                                <div className="flex-[2] space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Catatan</label>
                                                    <input type="text" placeholder="Catatan..." value={item.note || ''} onChange={(e) => handleNoteChange(item.id, e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[10px] font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t-2 border-dashed pt-5 space-y-5">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Grand Total</span>
                                    <span className="text-3xl font-black text-blue-600 tracking-tighter">Rp {total.toLocaleString()}</span>
                                </div>
                                <button
                                    disabled={cart.length === 0}
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-100 transition-all active:scale-[0.97]"
                                >
                                    Pilih Pembayaran
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Registrasi Member (Sama) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Registrasi Member</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveCustomer} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" disabled={isLoading} value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                                <input required type="tel" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" disabled={isLoading} value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat</label>
                                <input required type="tel" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" disabled={isLoading} value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-xs text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all" disabled={isLoading}>Batal</button>
                                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Konfirmasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Pembayaran */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                        <div className="p-10 bg-slate-50 w-full md:w-5/12 border-r border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Tagihan</p>
                            <div className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Rp {total.toLocaleString()}</div>
                            <div className="space-y-4">
                                <button onClick={() => setPaymentMethod('CASH')} className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${paymentMethod === 'CASH' ? 'border-blue-600 bg-white text-blue-600 shadow-lg shadow-blue-50' : 'border-slate-200 text-slate-400 bg-transparent hover:border-slate-300'}`}>
                                    <Banknote size={22}/> <span className="font-black text-xs uppercase tracking-widest">Tunai</span>
                                </button>
                                <button onClick={() => setPaymentMethod('QRIS')} className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${paymentMethod === 'QRIS' ? 'border-blue-600 bg-white text-blue-600 shadow-lg shadow-blue-50' : 'border-slate-200 text-slate-400 bg-transparent hover:border-slate-300'}`}>
                                    <QrCode size={22}/> <span className="font-black text-xs uppercase tracking-widest">QRIS / E-Wallet</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-10 w-full md:w-7/12 flex flex-col justify-between bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight italic">Finalisasi Order</h3>
                                <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"><X size={24}/></button>
                            </div>

                            {/* PILIHAN STATUS BAYAR */}
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={() => setPaymentStatus('PAID')}
                                    className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${paymentStatus === 'PAID' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                                >
                                    Bayar Sekarang
                                </button>
                                <button
                                    onClick={() => { setPaymentStatus('UNPAID'); setAmountPaid(0); }}
                                    className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${paymentStatus === 'UNPAID' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                                >
                                    Bayar Nanti
                                </button>
                            </div>

                            {paymentStatus === 'PAID' ? (
                                paymentMethod === 'CASH' ? (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Uang Tunai Diterima</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">Rp</span>
                                                <input
                                                    type="number"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-3xl font-black outline-none focus:ring-2 focus:ring-blue-600 tracking-tighter"
                                                    placeholder="0"
                                                    autoFocus
                                                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-5 bg-emerald-50 rounded-2xl flex justify-between items-center border border-emerald-100/50">
                                            <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest">Kembalian</span>
                                            <span className={`text-2xl font-black tracking-tighter ${change < 0 ? 'text-red-500' : 'text-emerald-700'}`}>
                                                Rp {change < 0 ? 0 : change.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4 text-center space-y-5">
                                        <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center border-4 border-slate-50 shadow-inner">
                                            <QrCode size={80} className="text-blue-600 opacity-80" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Harap pastikan pembayaran QRIS berhasil.</p>
                                    </div>
                                )
                            ) : (
                                <div className="p-10 bg-amber-50 rounded-[2rem] border-2 border-dashed border-amber-200 text-center animate-in zoom-in duration-300">
                                    <Clock size={32} className="mx-auto mb-4 text-amber-600" />
                                    <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-2">Mode Bayar Nanti</p>
                                    <p className="text-[10px] text-amber-600 font-medium leading-relaxed">Transaksi akan disimpan sebagai <span className="font-bold">UNPAID</span>. Pelanggan melunasi saat pengambilan.</p>
                                </div>
                            )}

                            <button
                                onClick={handleFinishTransaction}
                                disabled={isSubmitting || (paymentStatus === 'PAID' && paymentMethod === 'CASH' && amountPaid < total)}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all mt-8 flex items-center justify-center gap-3 active:scale-95 ${paymentStatus === 'PAID' ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700' : 'bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600'}`}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Konfirmasi & Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTransaction;