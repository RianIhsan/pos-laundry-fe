import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, X, Tag, Ruler } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formService, setFormService] = useState({ name: '', category: 'Kiloan', price: '', unit: 'kg' });

    // Konfigurasi Toast SweetAlert2
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await serviceService.getAll();
            setServices(response.data.data);
        } catch (err) {
            console.error("Gagal load layanan:", err);
            Toast.fire({
                icon: 'error',
                title: 'Gagal sinkronisasi katalog'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingSave(true);
        try {
            const payload = { ...formService, price: Number(formService.price) };
            if (editId) {
                await serviceService.update(editId, payload);
                Toast.fire({
                    icon: 'success',
                    title: 'Layanan berhasil diperbarui'
                });
            } else {
                await serviceService.create(payload);
                Toast.fire({
                    icon: 'success',
                    title: 'Layanan baru ditambahkan'
                });
            }
            setIsModalOpen(false);
            resetForm();
            fetchServices();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setIsLoadingSave(false);
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Hapus Layanan?',
            text: `Layanan "${name}" akan dihapus dari katalog.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            borderRadius: '1.5rem'
        });

        if (result.isConfirmed) {
            try {
                await serviceService.delete(id);
                Toast.fire({
                    icon: 'success',
                    title: 'Layanan berhasil dihapus'
                });
                fetchServices();
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Menghapus',
                    text: "Layanan mungkin sudah terikat dengan transaksi aktif.",
                    confirmButtonColor: '#3b82f6'
                });
            }
        }
    };

    const handleEditClick = (s) => {
        setEditId(s.id);
        setFormService({ name: s.name, category: s.category, price: s.price, unit: s.unit });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditId(null);
        setFormService({ name: '', category: 'Kiloan', price: '', unit: 'kg' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Katalog Layanan</h2>
                    <p className="text-slate-500 font-medium text-sm">Atur jenis jasa dan harga laundry Anda.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Tambah Layanan
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center opacity-50">
                    <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                    <p className="font-bold text-slate-500 text-sm tracking-widest uppercase italic">Loading Services...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s) => (
                        <div key={s.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${s.category === 'Kiloan' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {s.category}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEditClick(s)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(s.id, s.name)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h4 className="font-black text-slate-800 text-lg mb-1 tracking-tight">{s.name}</h4>
                            <p className="text-2xl font-black text-blue-600">
                                Rp {s.price.toLocaleString()} <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">/ {s.unit}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL ADD/EDIT SERVICE */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{editId ? 'Edit Katalog' : 'Layanan Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Layanan</label>
                                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" value={formService.name} onChange={(e) => setFormService({...formService, name: e.target.value})} placeholder="Contoh: Cuci Kering Kiloan" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                                    <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formService.category} onChange={(e) => setFormService({...formService, category: e.target.value})}>
                                        <option value="Kiloan">Kiloan</option>
                                        <option value="Satuan">Satuan</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                                    <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formService.unit} onChange={(e) => setFormService({...formService, unit: e.target.value})}>
                                        <option value="kg">kg</option>
                                        <option value="pcs">pcs</option>
                                        <option value="m2">m2</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xl tracking-tighter" value={formService.price} onChange={(e) => setFormService({...formService, price: e.target.value})} placeholder="7000" />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-xs text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition">Batal</button>
                                <button type="submit" disabled={isLoadingSave} className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center justify-center gap-2 transition active:scale-95">
                                    {isLoadingSave ? <Loader2 className="animate-spin" size={18} /> : (editId ? 'Update' : 'Simpan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;