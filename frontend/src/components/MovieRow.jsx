import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MovieCard } from './MovieCard';
import { TMDB_BASE_URL, TMDB_API_KEY } from '../api/axiosConfig';
import { ChevronRight, ChevronLeft, Crown } from 'lucide-react';

const MovieRow = ({ title, fetchUrl, genreId }) => {
    const [movies, setMovies] = useState([]);
    const rowRef = useRef(null);

    // دالة الألقاب الملكية
    const getRoyalTag = (title) => {
        const t = title.toLowerCase();
        if (t.includes('trending') || t.includes('popular')) return "World Premiere";
        if (t.includes('top rated')) return "Critics Choice";
        if (t.includes('action')) return "High Octane";
        if (t.includes('new')) return "Just Unlocked";
        return "Platinum Collection";
    };

    useEffect(() => {
        const fetchData = async () => {
            let url = `${TMDB_BASE_URL}${fetchUrl}?api_key=${TMDB_API_KEY}&language=en-US`;
            if (genreId) url += `&with_genres=${genreId}`;
            
            try {
                const res = await axios.get(url);
                setMovies(res.data.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchData();
    }, [fetchUrl, genreId]);

    const slide = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollAmount = direction === 'left' 
                ? scrollLeft - clientWidth * 0.8 
                : scrollLeft + clientWidth * 0.8;
            
            rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-20 relative group px-4 md:px-0">
            
            {/* Header Section - Clean & Royal */}
            <div className="flex items-end justify-between mb-8 pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-8 w-[3px] bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
                            {title}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            <Crown size={10} className="text-[#D4AF37] opacity-70" />
                            <span className="text-[8px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">
                                {getRoyalTag(title)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* أزرار التمرير - تظهر عند الحوم فقط */}
                <button 
                    onClick={() => slide('left')}
                    className="absolute -left-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 backdrop-blur-md p-4 rounded-full hidden group-hover:flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-2xl"
                >
                    <ChevronLeft size={24} strokeWidth={3} />
                </button>

                <div 
                    ref={rowRef}
                    className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide scroll-smooth"
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="min-w-[180px] md:min-w-[280px] transition-transform duration-500">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => slide('right')}
                    className="absolute -right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 backdrop-blur-md p-4 rounded-full hidden group-hover:flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-2xl"
                >
                    <ChevronRight size={24} strokeWidth={3} />
                </button>

                {/* تلاشي جانبي ناعم جداً */}
                <div className="absolute -left-2 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none hidden md:block" />
                <div className="absolute -right-2 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none hidden md:block" />
            </div>
        </div>
    );
};

export default MovieRow;