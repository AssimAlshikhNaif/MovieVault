import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Film, LogOut, Heart, ChevronDown, Crown, ShieldCheck } from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username") || "User";
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    };

    // --- وظيفة التمرير الذكي للأعلى ---
    const handleNavClick = (e, path) => {
        if (location.pathname === path) {
            e.preventDefault(); // منع الرابط من إعادة تحميل الصفحة
            window.scrollTo({
                top: 0,
                behavior: "smooth" // تمرير سلس وراقي
            });
        }
    };

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-700 px-6 md:px-12 ${
                isScrolled 
                ? "py-4 bg-black/80 backdrop-blur-2xl border-b border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                : "py-8 bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Brand Logo - التعديل هنا ليدعم التمرير للأعلى */}
                <Link 
                    to="/" 
                    onClick={(e) => handleNavClick(e, "/")}
                    className="flex items-center gap-3 group relative"
                >
                    <div className="relative">
                        <div className="bg-[#D4AF37] p-2 rounded-xl rotate-0 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                            <Crown size={20} className="text-black" fill="currentColor" />
                        </div>
                        <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                        Movie<span className="text-[#D4AF37]">Vault</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center gap-2">
                    {/* رابط Archive معدل ليدعم التمرير للأعلى */}
                    <NavItem 
                        to="/" 
                        label="Archive" 
                        active={location.pathname === "/"} 
                        onClick={(e) => handleNavClick(e, "/")}
                    />
                    
                    {token && (
                        <NavItem 
                            to="/myvault" 
                            label="My Vault" 
                            active={location.pathname === "/myvault"} 
                            onClick={(e) => handleNavClick(e, "/myvault")}
                            icon={<Heart size={14} className={location.pathname === "/myvault" ? "fill-[#D4AF37]" : ""} />} 
                        />
                    )}
                    
                    {token && role === "admin" && (
                        <Link to="/admin" className="ml-6 px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#b8952e] text-black rounded-full text-[10px] font-black border border-white/20 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Admin Access
                        </Link>
                    )}
                </nav>

                {/* User Suite */}
                <div className="flex items-center gap-6">
                    {token ? (
                        <div className="group relative flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2 rounded-2xl border border-white/5 transition-all cursor-pointer">
                            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[#D4AF37]/40 transition-all italic text-lg">
                                {username[0].toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Welcome</p>
                                <p className="text-sm font-black text-white tracking-tight">{username}</p>
                            </div>
                            <ChevronDown size={14} className="text-[#D4AF37] group-hover:rotate-180 transition-transform duration-500" />
                            
                            <div className="absolute top-[130%] right-0 w-48 bg-black/95 backdrop-blur-3xl border border-[#D4AF37]/20 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.7)] translate-y-4 group-hover:translate-y-0 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
                                <button 
                                    onClick={handleLogout} 
                                    className="relative z-10 w-full flex items-center justify-between px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    Relinquish Access <LogOut size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link to="/login" className="text-[10px] font-black text-slate-500 hover:text-[#D4AF37] transition-all tracking-[0.2em] uppercase italic">
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                className="relative group px-8 py-3.5 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl overflow-hidden transition-all hover:bg-[#D4AF37] active:scale-95"
                            >
                                <span className="relative z-10">Join Collection</span>
                                <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// تحديث NavItem لتستقبل onClick
const NavItem = ({ to, label, active, icon, onClick }) => (
    <Link 
        to={to} 
        onClick={onClick}
        className={`relative px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center gap-2 group ${
            active ? "text-[#D4AF37]" : "text-slate-500 hover:text-white"
        }`}
    >
        {icon}
        <span className="relative z-10">{label}</span>
        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] transition-all duration-500 ${
            active ? "w-6" : "w-0 group-hover:w-6"
        }`}></span>
    </Link>
);

export default Header;