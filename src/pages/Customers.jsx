import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Phone, MapPin, History, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { customerService } from '../services/customerService';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formCustomer, setFormCustomer] = useState({ name: '', phone: '', address: '' });

    // Custom Toast untuk notifikasi kecil di pojok
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await customerService.getAll();
            setCustomers(response.data.data);
        } catch (err) {
            console.error("Gagal load data pelanggan", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // --- HANDLER DELETE (SweetAlert2) ---
    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Hapus Pelanggan?',
            text: `Data ${name} akan dihapus permanen dari sistem!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Red-500
            cancelButtonColor: '#64748b', // Slate-500
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            borderRadius: '1.5rem'
        });

        if (result.isConfirmed) {
            try {
                await customerService.delete(id);
                Toast.fire({
                    icon: 'success',
                    title: 'Pelanggan berhasil dihapus'
                });
                fetchCustomers();
            } catch (err) {
                Swal.fire('Gagal!', err.response?.data?.message || "Terjadi kesalahan", 'error');
            }
        }
    };

    // --- HANDLER SIMPAN (SweetAlert2 Toast) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingSave(true);
        try {
            if (editId) {
                await customerService.update(editId, formCustomer);
                Toast.fire({
                    icon: 'success',
                    title: 'Data diperbarui'
                });
            } else {
                await customerService.create(formCustomer);
                Toast.fire({
                    icon: 'success',
                    title: 'Member baru terdaftar'
                });
            }
            setIsModalOpen(false);
            resetForm();
            fetchCustomers();
        } catch (err) {
            Swal.fire({
                title: 'Error!',
                text: err.response?.data?.message || "Gagal menyimpan data",
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setIsLoadingSave(false);
        }
    };

    const handleEditClick = (customer) => {
        setEditId(customer.id);
        setFormCustomer({
            name: customer.name,
            phone: customer.phone,
            address: customer.address
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditId(null);
        setFormCustomer({ name: '', phone: '', address: '' });
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Judul & Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Database Pelanggan</h2>
                    <p className="text-slate-500 font-medium text-sm">Kelola data member dan pantau loyalitas pelanggan.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                >
                    <UserPlus size={18} /> Tambah Member
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama atau nomor telepon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm font-medium"
                />
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center opacity-50">
                    <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                    <p className="font-bold text-slate-500 text-sm italic tracking-widest uppercase">Syncing Database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                                    {customer.name.charAt(0)}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditClick(customer)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(customer.id, customer.name)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6 relative z-10">
                                <h4 className="font-black text-slate-800 text-lg leading-tight">{customer.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Member ID: #{customer.id}
                                </p>
                            </div>

                            <div className="space-y-3 mb-6 relative z-10">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone size={16} className="text-slate-400" />
                                    <span className="text-sm font-medium tracking-tight">{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-sm font-medium truncate">{customer.address || "Alamat tidak tersedia"}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <History size={14} /> Riwayat Transaksi
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form (Add/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{editId ? 'Edit Profil Member' : 'Pendaftaran Member'}</h3>
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" disabled={isLoadingSave} value={formCustomer.name} onChange={(e) => setFormCustomer({...formCustomer, name: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                                <input required type="tel" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" disabled={isLoadingSave} value={formCustomer.phone} onChange={(e) => setFormCustomer({...formCustomer, phone: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Domisili</label>
                                <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" rows="3" disabled={isLoadingSave} value={formCustomer.address} onChange={(e) => setFormCustomer({...formCustomer, address: e.target.value})} />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 py-4 font-black text-xs text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition" disabled={isLoadingSave}>Batal</button>
                                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center justify-center gap-2 transition" disabled={isLoadingSave}>
                                    {isLoadingSave ? <Loader2 className="animate-spin" size={18} /> : (editId ? 'Update' : 'Daftarkan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;