import React from 'react';
import { ChevronDown, Crown,  KeyRound, LayoutGrid } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();
  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = !!localStorage.getItem('token');

  const handleAction = () => {
    if (isLoggedIn) {
      // للمستخدم المسجل: التوجه للمفضلة (إرثه الخاص)
      navigate('/myvault'); 
    } else {
      // للمستخدم الجديد: التوجه للتسجيل لفك القفل
      navigate('/register');
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80, 
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen min-h-[750px] flex items-center justify-center overflow-hidden bg-[#050505] selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. طبقات الخلفية والظلال السينمائية */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black" />
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0 scale-105 animate-soft-zoom"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop)' }}
      />

      {/* 2. جزيئات الذهب الطافية */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-[#D4AF37] rounded-full blur-[2px] animate-pulse opacity-30" />
          <div className="absolute top-[60%] right-[10%] w-2 h-2 bg-[#D4AF37] rounded-full blur-[4px] animate-ping opacity-10" />
          <div className="absolute bottom-[30%] left-[40%] w-1.5 h-1.5 bg-[#D4AF37] rounded-full blur-[2px] animate-bounce opacity-20" />
      </div>
      
      {/* 3. المحتوى الرئيسي */}
      <div className="relative z-20 text-center px-6 max-w-[1200px] flex flex-col items-center">
        
        {/* شارة التميز */}
        <div className="flex items-center gap-3 mb-10 px-6 py-2 rounded-full border border-[#D4AF37]/20 bg-black/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(212,175,55,0.1)] animate-fade-in">
            <Crown size={14} className="text-[#D4AF37]" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]/80">The Sovereign Vault</span>
        </div>

        {/* العنوان */}
        <h1 className="text-white font-black leading-[0.85] uppercase italic tracking-tighter mb-10 text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] animate-slide-up">
          UNVEIL <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] via-[#f5e0a3] to-[#8a6d23] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            LEGENDS
          </span>
        </h1>
        
        <p className="text-zinc-500 text-xs md:text-sm lg:text-base font-bold tracking-[0.3em] leading-relaxed mb-16 max-w-xl mx-auto uppercase opacity-90 animate-fade-in-delayed">
          Beyond watching. Beyond streaming. <br/> 
          <span className="text-zinc-300">Enter the private archive of cinematic gold.</span>
        </p>
        
        {/* مصفوفة الأزرار: تم توحيد العرض (280px) لضمان التوازن */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-4xl mx-auto animate-fade-in-delayed">
          
          {/* الزر الرئيسي: Unlock Your Legacy */}
          <button 
            onClick={handleAction} 
            className="group relative flex items-center justify-center bg-[#D4AF37] text-black px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_-15px_rgba(212,175,55,0.4)] overflow-hidden w-full sm:w-[280px]"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
            
            {isLoggedIn ? (
              <LayoutGrid size={18} className="mr-3 relative z-10" />
            ) : (
              <KeyRound size={18} className="mr-3 relative z-10" />
            )}

            <span className="relative z-10 truncate">
              {isLoggedIn ? "Access My Legacy" : "Unlock Your Legacy"}
            </span>
          </button>
          
          {/* الزر الثاني: Explore Library */}
          <button 
            onClick={scrollToContent} 
            className="group flex items-center justify-center bg-white/[0.03] text-white px-10 py-5 rounded-2xl border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 backdrop-blur-xl w-full sm:w-[280px] shadow-2xl"
          >
            <Crown size={18} className="mr-3 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-500" />
            <span className="truncate">Explore Library</span>
          </button>
        </div>

        {/* مؤشر النزول: الآن سيبقى في المنتصف لأن الأزرار أعلاه متساوية العرض */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 group transition-opacity duration-1000 opacity-60 hover:opacity-100 cursor-pointer"
          onClick={scrollToContent}
        >
            <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.5em] mb-2 animate-pulse">Discovery</span>
            <div className="relative w-[1px] h-14 bg-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-[#D4AF37] -translate-y-full group-hover:translate-y-0 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent animate-infinite-scroll" />
            </div>
            <ChevronDown size={14} className="text-[#D4AF37] group-hover:translate-y-1 transition-transform" />
        </div>
      </div>
    </section>
  );
}