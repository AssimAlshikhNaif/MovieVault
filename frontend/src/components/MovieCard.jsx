import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Play, Loader2 } from 'lucide-react';
import axiosInstance, { TMDB_IMAGE_URL } from '../api/axiosConfig';
import toast from 'react-hot-toast'; // استيراد التوست

export function MovieCard({ movie }) {
    const navigate = useNavigate();
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";

    const handleAddToMyvault = async (e) => {
        e.stopPropagation(); 
        
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to build your myvault! 🔐", {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        const loadingToast = toast.loading(`Adding ${movie.title}...`);

        try {
            await axiosInstance.post("/myvault/add", { 
                movieId: movie.id,
                title: movie.title, 
                poster_path: movie.poster_path 
            });

            // نجاح العملية
            toast.success(`${movie.title} added to Myvault! ✅`, {
                id: loadingToast, // استبدال رسالة التحميل بالنجاح
                icon: '🍿',
                style: {
                    borderRadius: '12px',
                    background: '#0f172a',
                    color: '#fff',
                    border: '1px solid rgba(239, 201, 76, 0.2)'
                }
            });
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to add to myvault.";
            
            // التعامل مع الأخطاء (مثل إذا كان الفيلم موجوداً بالفعل)
            toast.error(errorMessage, {
                id: loadingToast,
                style: {
                    borderRadius: '12px',
                    background: '#0f172a',
                    color: '#fff',
                }
            });
        }
    };

    return (
        <div 
            className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:border-[#efc94c]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            onClick={() => navigate(`/movie/${movie.id}`)}
        >
            {/* Poster Image */}
            <div className="relative h-[350px] overflow-hidden">
                <img
                    src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster' }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                    
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 line-clamp-3">
                        {movie.overview || 'No description available for this movie.'}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex gap-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        <button 
                            className="flex-1 bg-[#efc94c] text-slate-950 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                        >
                            <Play size={14} fill="currentColor" /> DETAILS
                        </button>
                        <button 
                            className="p-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-red-600 transition-all border border-white/10 group/plus"
                            onClick={handleAddToMyvault}
                            title="Add to Myvault"
                        >
                            <Plus size={18} className="group-hover/plus:rotate-90 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1 group-hover:bg-[#efc94c] transition-colors duration-500">
                    <Star size={12} className="text-[#efc94c] group-hover:text-slate-950" fill="currentColor" />
                    <span className="text-xs font-black text-white group-hover:text-slate-950">{rating}</span>
                </div>
            </div>
            
            {/* Movie Info Section */}
            <div className="p-4 bg-gradient-to-b from-transparent to-slate-950/50">
                <h3 className="text-sm font-bold text-white truncate mb-2 group-hover:text-[#efc94c] transition-colors uppercase tracking-tight">
                    {movie.title}
                </h3>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 border border-slate-800 rounded-md">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#efc94c] animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Movie Hit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}