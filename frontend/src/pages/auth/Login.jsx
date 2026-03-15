import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // استيراد موشن
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Crown, ChevronRight, Loader2,  } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadToast = toast.loading("Verifying your access to the vault...", {
            style: { background: '#000', color: '#D4AF37', border: '1px solid #D4AF37/20' }
        });

        try {
            const response = await axiosInstance.post("/auth/login", formData);
            const data = response.data;
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("username", data.user.username);
            
            toast.success(`Welcome back, Sovereign ${data.user.username}! 🥂`, { id: loadToast });

            setTimeout(() => {
                data.user.role === "admin" ? navigate("/admin") : navigate("/");
                window.location.reload();
            }, 1000);

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Entry denied. Check your keys.";
            toast.error(errorMsg, { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ x: "-100%", opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}      
            exit={{ x: "-100%", opacity: 0 }}   
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}    
            className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans"
        >
            
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />

            <div className="flex w-full max-w-6xl bg-black/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/5 h-[700px] relative z-10">
                
                <div className="w-full lg:w-[45%] p-10 md:p-16 flex flex-col justify-center relative bg-gradient-to-br from-white/[0.02] to-transparent">
                    
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                <Crown className="text-black" size={26} fill="currentColor" />
                            </div>
                            <span className="text-white font-black tracking-tighter text-3xl uppercase italic">
                                Movie<span className="text-[#D4AF37]">Vault</span>
                            </span>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">The Return</h2>
                        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase opacity-70">Unlock your premium cinematic collection.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] ml-1">Identity (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#D4AF37] transition-all duration-500" size={18} />
                                <input 
                                    type="email" 
                                    className="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-5 py-5 rounded-[1.5rem] focus:border-[#D4AF37]/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
                                    placeholder="Enter registered email"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] ml-1">Secret Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#D4AF37] transition-all duration-500" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-14 py-5 rounded-[1.5rem] focus:border-[#D4AF37]/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(212,175,55,0.3)] hover:shadow-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 group uppercase text-[11px] tracking-[0.3em] mt-8"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Authorize Access
                                    <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="hidden lg:flex w-[55%] relative p-16 flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 hover:scale-100" 
                         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop)' }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#D4AF37]/30" />
                    
                    <div className="z-10 relative">
                        <div className="flex items-center gap-2 mb-6">
                            <Crown className="text-[#D4AF37]" size={20} />
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">The Masterpiece Hub</span>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[0.9] italic uppercase tracking-tighter mb-8">
                            Experience <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-white">Greatness</span>
                        </h2>
                        <p className="text-slate-300 font-medium text-lg max-w-sm leading-relaxed border-l-2 border-[#D4AF37] pl-6 py-2">
                            Where every frame is a treasure and every story is royalty.
                        </p>
                    </div>

                    <div className="z-10 relative bg-black/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-white font-black uppercase tracking-widest text-xs mb-1">New To The Archive?</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider italic">Join the elite collectors today.</p>
                        </div>
                        <button 
                            onClick={() => navigate("/register")}
                            className="bg-white text-black px-8 py-3.5 rounded-xl font-black hover:bg-[#D4AF37] transition-all duration-500 uppercase text-[10px] tracking-widest shadow-2xl"
                        >
                            Get Key
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;