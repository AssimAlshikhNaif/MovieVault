import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { TMDB_IMAGE_URL } from "../api/axiosConfig";
import toast from "react-hot-toast";
import { Trash2, Loader2, ArrowLeft, ShieldCheck, LayoutGrid, Quote } from "lucide-react";

const Myvault = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyvault = async () => {
            try {
                const response = await axiosInstance.get('/myvault'); 
                setMovies(Array.isArray(response.data) ? response.data : []);
           } catch (err) {
             console.error("Vault Error:", err);     
             toast.error("Vault sync failed.");
             setMovies([]);

            } finally {
                setLoading(false);
            }
        };
        fetchMyvault();
    }, []);

    const removeFromMyvault = async (movieId) => {
        try {
            await axiosInstance.delete(`/myvault/${movieId}`);
            setMovies(prev => prev.filter(movie => movie.movie_id !== movieId));
            toast.success('Removed from Vault');
       } catch (err) {
    console.error("Vault Error:", err); 
    toast.error('Operation failed');
}
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
            <Loader2 className="text-[#D4AF37] animate-spin" size={50} />
            <p className="text-[#D4AF37] font-black tracking-[0.4em] text-[10px] uppercase animate-pulse">Accessing Your Vault...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative selection:bg-[#D4AF37] selection:text-black">
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

            <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-40 pb-20 relative z-20">
                
                <div className="mb-12 flex justify-start">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group flex items-center gap-3 py-2.5 px-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-500"
                    >
                        <ArrowLeft size={16} className="text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white">
                            Exit Vault
                        </span>
                    </button>
                </div>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 pb-12 border-b border-white/5">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-red-600/80 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <div className="h-[1px] w-8 bg-red-600" />
                            <span className="text-[9px] font-black uppercase tracking-[0.5em]">Private Collection</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                            MY <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-700">VAULT</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 bg-zinc-900/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                        <div className="relative">
                             <ShieldCheck size={32} className="text-[#D4AF37]" />
                             <div className="absolute inset-0 blur-lg bg-[#D4AF37]/20" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Secured Assets</span>
                            <span className="text-4xl font-black italic tracking-tighter text-white">
                                {movies.length.toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </header>

                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                         <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-300">Critiques</h2>
                         <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     
                    </div>
                </section>

                {movies.length === 0 ? (
                    <div className="py-48 text-center bg-zinc-900/10 rounded-[4rem] border border-dashed border-zinc-800/50">
                        <p className="text-zinc-700 uppercase font-black tracking-[0.4em] text-[10px]">Your legacy is currently empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-10 gap-y-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        {movies.map((movie) => (
                            <div key={movie.movie_id} className="group relative">
                                <div 
                                    className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 group-hover:-translate-y-5 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                                    onClick={() => navigate(`/movie/${movie.movie_id}`)}
                                >
                                    <img 
                                        src={movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750'} 
                                        alt={movie.title} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromMyvault(movie.movie_id);
                                        }}
                                        className="absolute top-6 right-6 p-4 bg-red-600 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.4)]"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="mt-8 px-4 text-center">
                                    <h3 className="text-[11px] font-black uppercase italic tracking-[0.15em] text-zinc-500 group-hover:text-white transition-colors truncate">
                                        {movie.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Myvault; 