import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log("Mengirim data ke Backend Go:", data);

        // Simulasi hit API Login
        setTimeout(() => {
            setIsLoading(false);
            alert("Cek konsol! Ini saatnya kamu kirim token JWT dari Go.");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                <div className="p-8 md:p-12">
                    {/* LOGO & HEADER */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">LAUNDRY.PRO</h2>
                        <p className="text-slate-500 font-medium mt-2">Owner & Admin Dashboard Access</p>
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
                            Lupa password? Hubungi <span className="text-blue-500 cursor-pointer hover:underline font-bold">IT Support</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;