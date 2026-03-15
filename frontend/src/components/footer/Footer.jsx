import React from 'react';
import { Link } from 'react-router-dom'; 
import { Facebook, Twitter, Instagram, Github, Crown } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#000000] pt-12 pb-6 px-6 border-t border-[#D4AF37]/20 text-white mt-auto">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-start gap-8">
        
        <div className="flex-1 min-w-[200px]">
          <Link to="/" className="flex items-center gap-2 mb-3 group">
            <Crown className="text-[#D4AF37] group-hover:scale-110 transition-transform" size={22} />
            <h2 className="text-xl font-black tracking-tighter uppercase italic">
              MOVIE<span className="text-[#D4AF37]">VAULT</span>
            </h2>
          </Link>
          <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs font-medium uppercase tracking-wider">
            Premium Cinema Experience.
          </p>
        </div>

        <div className="flex-[2] min-w-[300px] flex justify-around">
          <div className="flex flex-col gap-3">
            <h4 className="text-[#D4AF37] font-black text-[9px] uppercase tracking-[0.3em] mb-1 opacity-60">Navigate</h4>
            <Link to="/" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Archive</Link>
            <Link to="/trending" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Trending</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[#D4AF37] font-black text-[9px] uppercase tracking-[0.3em] mb-1 opacity-60">Account</h4>
            <Link to="/myvault" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Myvault</Link>
            <Link to="/admin" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Admin Hub</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[#D4AF37] font-black text-[9px] uppercase tracking-[0.3em] mb-1 opacity-60">Legal</h4>
            <Link to="/privacy" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Privacy</Link>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Github].map((Icon, index) => (
              <a 
                key={index} 
                href="#" 
                className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
        <p>© 2026 MOVIEVAULT</p>
        <p className="text-amber-500/20 italic">Masterpiece Collection</p>
      </div>
    </footer>
  );
};

export default Footer;