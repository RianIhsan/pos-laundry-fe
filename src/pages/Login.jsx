import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Lock, User, Eye, EyeOff, Loader2, X,
    Linkedin, Instagram, Github, Headset, Coffee
} from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false); // State Modal Baru

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const response = await api.post('/login', {
                username: formData.username,
                password: formData.password
            });

            const { access_token, refresh_token, role, username } = response.data.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user_role', role);
            localStorage.setItem('username', username);

            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error("Login Error:", error);
            alert(error.response?.data?.message || "Gagal login. Cek koneksi backend.");
        } finally {
            setIsLoading(false);
        }
    };

    // Data Sosial Media Kamu
    const socialMedia = [
        {
            name: 'LinkedIn',
            icon: <Linkedin size={20} />,
            url: 'https://www.linkedin.com/in/rianihsan',
            color: 'hover:bg-blue-600 hover:text-white',
            textColor: 'text-blue-600'
        },
        {
            name: 'Instagram',
            icon: <Instagram size={20} />,
            url: 'https://www.instagram.com/devwithyon',
            color: 'hover:bg-pink-600 hover:text-white',
            textColor: 'text-pink-600'
        },
        {
            name: 'GitHub',
            icon: <Github size={20} />,
            url: 'https://github.com/RianIhsan',
            color: 'hover:bg-slate-800 hover:text-white',
            textColor: 'text-slate-800'
        },
        {
            name: 'Trakteer (Support Me)',
            icon: <Coffee size={20} />, // Jangan lupa import Coffee dari lucide-react
            url: 'https://teer.id/kqropuqvtsxhzsgfed1y',
            color: 'hover:bg-red-600 hover:text-white',
            textColor: 'text-red-600'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                <div className="p-8 md:p-12">
                    {/* LOGO & HEADER */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">WASH EXPRESS</h2>
                        <p className="text-slate-500 font-medium mt-2">I WISH YOU WASH HERE</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* USERNAME */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    {...register("username", { required: "Username wajib diisi" })}
                                    type="text"
                                    placeholder="Masukkan username"
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.username ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all`}
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.username.message}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    {...register("password", { required: "Password wajib diisi" })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    MENGOTENTIKASI...
                                </>
                            ) : (
                                "MASUK KE DASHBOARD"
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            Lupa password? Hubungi <span
                            onClick={() => setIsSupportModalOpen(true)}
                            className="text-blue-500 cursor-pointer hover:underline font-bold"
                        >
                                IT Support
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* --- MODAL IT SUPPORT --- */}
            {isSupportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-100 animate-in zoom-in duration-300">
                        {/* Tombol Close */}
                        <button
                            onClick={() => setIsSupportModalOpen(false)}
                            className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-50 rounded-xl"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Headset size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Butuh Bantuan?</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1 mb-8">Hubungi pengembang melalui:</p>

                            <div className="space-y-3">
                                {socialMedia.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-between p-4 rounded-2xl border border-slate-100 font-bold text-sm transition-all duration-300 ${social.textColor} ${social.color} group`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {social.icon}
                                            <span>{social.name}</span>
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Kunjungi
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsSupportModalOpen(false)}
                                className="mt-8 text-xs font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;