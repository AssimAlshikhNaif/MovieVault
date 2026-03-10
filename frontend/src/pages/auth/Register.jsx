import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // استيراد موشن
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, Crown, ChevronLeft, Loader2,  } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadToast = toast.loading("Forging your royal membership...", {
            style: { background: '#000', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }
        });

        try {
            await axiosInstance.post("/auth/register", formData);
            toast.success("Membership granted! Welcome to the elite. 🎉", { id: loadToast });
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Protocol failed. Try again.";
            toast.error(errorMessage, { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        // 🎞️ تغليف الصفحة بموشن ديف للانزلاق من اليمين
        <motion.div 
            initial={{ x: "100%", opacity: 0 }} // يبدأ من خارج الشاشة يميناً
            animate={{ x: 0, opacity: 1 }}      // يتحرك للوسط
            exit={{ x: "100%", opacity: 0 }}    // يخرج لليمين عند المغادرة
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans"
        >
            
            {/* 🌌 Atmospheric Glows */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[120px] animate-pulse" />

            <div className="flex flex-row-reverse w-full max-w-6xl bg-black/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/5 h-auto min-h-[750px] relative z-10">
                
                {/* 📝 Registration Form (Right Side) */}
                <div className="w-full lg:w-[45%] p-10 md:p-16 flex flex-col justify-center bg-gradient-to-bl from-white/[0.02] to-transparent">
                    
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                <Crown className="text-black" size={26} fill="currentColor" />
                            </div>
                            <span className="text-white font-black tracking-tighter text-3xl uppercase italic">Movie<span className="text-[#D4AF37]">Vault</span></span>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">The Initiation</h2>
                        <p className="text-slate-500 font-bold text-[11px] tracking-[0.2em] uppercase opacity-70">Begin your legacy in the cinematic archives.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] ml-1">Codename (Username)</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#D4AF37] transition-all" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.username}
                                    className="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-5 py-4.5 rounded-[1.5rem] focus:border-[#D4AF37]/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
                                    placeholder="Unique alias"
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] ml-1">Secure Channel (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#D4AF37] transition-all" size={18} />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    className="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-5 py-4.5 rounded-[1.5rem] focus:border-[#D4AF37]/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
                                    placeholder="Personal address"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] ml-1">Master Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#D4AF37] transition-all" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    className="w-full bg-white/[0.03] border border-white/5 text-white pl-14 pr-14 py-4.5 rounded-[1.5rem] focus:border-[#D4AF37]/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
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
                            className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(212,175,55,0.3)] hover:shadow-[#D4AF37]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.3em] mt-6"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Membership"}
                        </button>
                    </form>
                </div>

                {/* 🎨 Cinematic Visual Panel (Left Side) */}
                <div className="hidden lg:flex w-[55%] relative p-16 flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] scale-100 hover:scale-110" 
                         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop)' }} />
                    <div className="absolute inset-0 bg-gradient-to-bl from-black/90 via-black/40 to-[#D4AF37]/20" />
                    
                    <div className="z-10 relative">
                        <div className="flex items-center gap-2 mb-6">
                            <Crown className="text-[#D4AF37]" size={20} />
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">The Royal Invitation</span>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[0.9] italic uppercase tracking-tighter mb-8">
                            Join The <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37]">Inner Circle</span>
                        </h2>
                    </div>

                    <div className="z-10 relative bg-black/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[#D4AF37] font-black uppercase tracking-widest text-xs mb-1 italic">Identity Verified?</p>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider">Return to your session immediately.</p>
                        </div>
                        <button 
                            onClick={() => navigate("/login")}
                            className="group flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl font-black hover:bg-white hover:text-black transition-all duration-500 uppercase text-[10px] tracking-widest"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;