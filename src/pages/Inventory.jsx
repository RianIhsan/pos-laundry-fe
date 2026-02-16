import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, X, Box, AlertTriangle, Thermometer } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import Swal from 'sweetalert2';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formItem, setFormItem] = useState({
        name: '', description: '', category: 'DETERGENT',
        current_stock: '', max_stock: '', critical_level: '', unit: 'Liter'
    });

    const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
    });

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await inventoryService.getAll();
            setItems(response.data.data);
        } catch (err) {
            console.error("Gagal load inventory", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingSave(true);
        try {
            const payload = {
                ...formItem,
                current_stock: Number(formItem.current_stock),
                max_stock: Number(formItem.max_stock),
                critical_level: Number(formItem.critical_level)
            };

            if (editId) {
                await inventoryService.update(editId, payload);
                Toast.fire({ icon: 'success', title: 'Stok diperbarui' });
            } else {
                await inventoryService.create(payload);
                Toast.fire({ icon: 'success', title: 'Barang baru ditambahkan' });
            }
            setIsModalOpen(false);
            resetForm();
            fetchInventory();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error');
        } finally { setIsLoadingSave(false); }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Hapus Barang?',
            text: `Barang ${name} akan dihapus dari sistem!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!'
        });

        if (result.isConfirmed) {
            try {
                await inventoryService.delete(id);
                Toast.fire({ icon: 'success', title: 'Berhasil dihapus' });
                fetchInventory();
            } catch (err) { Swal.fire('Gagal', 'Barang sedang digunakan', 'error'); }
        }
    };

    const handleEditClick = (item) => {
        setEditId(item.id);
        setFormItem({
            name: item.name, description: item.description, category: item.category,
            current_stock: item.current_stock, max_stock: item.max_stock,
            critical_level: item.critical_level, unit: item.unit
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditId(null);
        setFormItem({
            name: '', description: '', category: 'DETERGENT',
            current_stock: '', max_stock: '', critical_level: '', unit: 'Liter'
        });
    };

    const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Kontrol Inventori</h2>
                    <p className="text-slate-500 font-medium text-sm">Monitor deterjen, pewangi, dan bahan baku lainnya.</p>
                </div>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                    <Plus size={18} /> Tambah Stok
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Cari nama barang..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm" />
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center opacity-50"><Loader2 className="animate-spin text-blue-600 mb-2" size={40} /><p className="font-bold text-slate-500">Menyinkronkan Stok...</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.status === 'SAFE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                                    {item.status}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEditClick(item)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h4 className="font-black text-slate-800 text-lg">{item.name}</h4>
                            <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-1">{item.description}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Kapasitas Stok</span>
                                    <span>{item.current_stock} / {item.max_stock} {item.unit}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${item.stock_percentage <= 25 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${item.stock_percentage}%` }}></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <AlertTriangle size={14} className={item.current_stock <= item.critical_level ? 'text-red-500' : 'text-slate-300'} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Level Kritis: {item.critical_level} {item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL ADD/EDIT INVENTORY */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{editId ? 'Edit Stok' : 'Tambah Stok Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Barang</label>
                                <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formItem.name} onChange={(e) => setFormItem({...formItem, name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formItem.category} onChange={(e) => setFormItem({...formItem, category: e.target.value})}>
                                        <option value="DETERGENT">Deterjen</option>
                                        <option value="FRAGRANCE">Pewangi</option>
                                        <option value="PACKAGING">Kemasan</option>
                                        <option value="OTHER">Lainnya</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                                    <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formItem.unit} onChange={(e) => setFormItem({...formItem, unit: e.target.value})} placeholder="Liter/Kg/Pcs" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok Skrg</label>
                                    <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formItem.current_stock} onChange={(e) => setFormItem({...formItem, current_stock: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Stok</label>
                                    <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formItem.max_stock} onChange={(e) => setFormItem({...formItem, max_stock: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level Kritis</label>
                                    <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-red-500" value={formItem.critical_level} onChange={(e) => setFormItem({...formItem, critical_level: e.target.value})} />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-xs text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition">Batal</button>
                                <button type="submit" disabled={isLoadingSave} className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition active:scale-95">
                                    {isLoadingSave ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Stok'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;