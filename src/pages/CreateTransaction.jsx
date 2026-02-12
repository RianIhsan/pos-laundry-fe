import React, { useState } from 'react';
import { Search, Plus, Trash2, ShoppingCart, X, Banknote, QrCode, Calculator, Minus, Plus as PlusIcon } from 'lucide-react';

const CreateTransaction = () => {
    // --- STATES ---
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal Pelanggan
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Modal Bayar
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [amountPaid, setAmountPaid] = useState(0);

    // --- DATA DUMMY ---
    const services = [
        { id: 1, name: 'Cuci Kering Kiloan', price: 7000, unit: 'kg', category: 'Kiloan' },
        { id: 2, name: 'Cuci Setrika Kiloan', price: 10000, unit: 'kg', category: 'Kiloan' },
        { id: 3, name: 'Bedcover Besar', price: 35000, unit: 'pcs', category: 'Satuan' },
        { id: 4, name: 'Jas Setelan', price: 45000, unit: 'pcs', category: 'Satuan' },
    ];

    // --- LOGIC KERANJANG ---
    const addToCart = (service) => {
        const existing = cart.find(item => item.id === service.id);
        if (existing) {
            setCart(cart.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...service, qty: 1 }]);
        }
    };

    // const updateQty = (id, delta) => {
    //     setCart(cart.map(item => {
    //         if (item.id === id) {
    //             const newQty = item.qty + delta;
    //             return { ...item, qty: newQty > 0 ? newQty : 1 };
    //         }
    //         return item;
    //     }));
    // };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const change = amountPaid - total;

    // --- HANDLERS ---
    const handleSaveCustomer = (e) => {
        e.preventDefault();
        alert(`Pelanggan ${newCustomer.name} berhasil ditambahkan!`);
        setIsModalOpen(false);
        setNewCustomer({ name: '', phone: '', address: '' });
    };

    const handleFinishTransaction = () => {
        const payload = {
            items: cart,
            total_amount: total,
            payment_method: paymentMethod,
            amount_paid: paymentMethod === 'CASH' ? amountPaid : total
        };
        console.log("Kirim ke API POST /transactions:", payload);
        alert("Transaksi Berhasil Disimpan!");
        setCart([]);
        setIsPaymentModalOpen(false);
        setAmountPaid(0);
    };

    const handleWeightChange = (id, value) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, qty: parseFloat(value) || 0 } : item
        ));
    };

    const handleNoteChange = (id, note) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, note: note } : item
        ));
    };

    return (
        <div className="relative">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800">Order Baru</h2>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* SISI KIRI: Katalog & Cari */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Cari pelanggan..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none" />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md"
                            >
                                <Plus size={18} /> Pelanggan Baru
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {services.map((s) => (
                                <button key={s.id} onClick={() => addToCart(s)} className="p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-500 hover:shadow-sm transition-all group">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block uppercase">{s.category}</span>
                                    <p className="font-bold text-slate-800 group-hover:text-blue-600">{s.name}</p>
                                    <p className="text-sm text-slate-500 font-medium">Rp {s.price.toLocaleString()}/{s.unit}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SISI KANAN: Keranjang */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-6 shadow-sm">
                            <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-800 border-b pb-4">
                                <ShoppingCart size={20} className="text-blue-600" /> Detail Pesanan
                            </h3>

                            <div className="space-y-4 min-h-[150px] max-h-[40vh] overflow-y-auto mb-6 pr-2">
                                {cart.length === 0 ? (
                                    <div className="text-center py-10 opacity-30 italic text-sm">Keranjang kosong</div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                                                        Rp {item.price.toLocaleString()} / {item.unit}
                                                    </p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex gap-3">
                                                {/* INPUT BERAT MANUAL / QTY */}
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Jumlah ({item.unit})</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={item.qty}
                                                            onChange={(e) => handleWeightChange(item.id, e.target.value)}
                                                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* INPUT CATATAN ITEM */}
                                                <div className="flex-[2] space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Catatan Khusus</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Contoh: Noda di kerah, luntur..."
                                                        value={item.note || ''}
                                                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-slate-500">Total Tagihan</span>
                                    <span className="text-2xl font-black text-blue-600">Rp {total.toLocaleString()}</span>
                                </div>
                                <button
                                    disabled={cart.length === 0}
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-200 transition-all"
                                >
                                    Bayar Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PELANGGAN BARU */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Tambah Pelanggan</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
                                <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">No. WhatsApp</label>
                                <input required type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Batal</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL PEMBAYARAN */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
                        <div className="p-8 bg-slate-50 w-full md:w-5/12 border-r">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Tagihan</p>
                            <div className="text-4xl font-black text-slate-900 mb-8">Rp {total.toLocaleString()}</div>
                            <div className="space-y-3">
                                <button onClick={() => setPaymentMethod('CASH')} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'CASH' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-200 text-slate-500'}`}><Banknote size={20}/> Tunai</button>
                                <button onClick={() => setPaymentMethod('QRIS')} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'QRIS' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-200 text-slate-500'}`}><QrCode size={20}/> QRIS</button>
                            </div>
                        </div>
                        <div className="p-8 w-full md:w-7/12 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Selesaikan Bayar</h3>
                                <button onClick={() => setIsPaymentModalOpen(false)}><X className="text-slate-400"/></button>
                            </div>
                            {paymentMethod === 'CASH' ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600">Uang Diterima</label>
                                        <input type="number" className="w-full p-4 bg-slate-100 border-none rounded-2xl text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" placeholder="0" onChange={(e) => setAmountPaid(Number(e.target.value))} />
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-2xl flex justify-between items-center border border-amber-100">
                                        <span className="text-amber-800 font-medium">Kembalian</span>
                                        <span className={`text-xl font-bold ${change < 0 ? 'text-red-500' : 'text-amber-700'}`}>Rp {change < 0 ? 0 : change.toLocaleString()}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-6 text-center space-y-4">
                                    <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <QrCode size={48} className="text-slate-300" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">QRIS akan di-generate otomatis saat di-klik konfirmasi</p>
                                </div>
                            )}
                            <button onClick={handleFinishTransaction} disabled={paymentMethod === 'CASH' && amountPaid < total} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-700 disabled:bg-slate-200 transition mt-6">Konfirmasi & Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTransaction;