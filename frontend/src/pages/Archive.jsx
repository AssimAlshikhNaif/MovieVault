import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { MovieCard } from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import { TMDB_BASE_URL, TMDB_API_KEY } from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { Settings, Plus, Loader2, LayoutGrid, Search, X } from 'lucide-react';

const Archive = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const genreId = searchParams.get('genre');
    const userRole = localStorage.getItem("role");

    // حالة التحقق مما إذا كان المستخدم يبحث حالياً (للتأثير البصري)
    const isSearching = searchQuery.length > 0;

    const fetchMovies = async (pageNum, isNewSearch = false) => {
        try {
            let url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${pageNum}`;
            if (searchQuery) {
                url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=${pageNum}`;
            } else if (genreId) {
                url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genreId}&page=${pageNum}`;
            }

            const { data } = await axios.get(url);
            setMovies(prev => isNewSearch ? data.results : [...prev, ...data.results]);
        }  catch (err) {
    // استخدم المتغير هنا لطباعة الخطأ الحقيقي في المتصفح
    console.error("Connection lost:", err); 
    toast.error("Vault link unstable. Check server status.");

        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        setPage(1);
        const timer = setTimeout(() => fetchMovies(1, true), 400);
        return () => clearTimeout(timer);
    }, [genreId, searchQuery]);

    const handleLoadMore = () => {
        setIsFetchingMore(true);
        setPage(prev => prev + 1);
        fetchMovies(page + 1);
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white pb-20 selection:bg-[#D4AF37] selection:text-black transition-colors duration-1000">
            
            {/* 1. تأثير تعتيم الهيرو عند البحث */}
            <div className={`transition-all duration-1000 transform ${isSearching ? 'opacity-20 scale-95 blur-sm pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
                <HeroSection />
            </div>

            <main className={`max-w-[1600px] mx-auto px-6 md:px-12 transition-all duration-700 ${isSearching ? '-mt-64 relative z-50' : 'py-12'}`}>
                
                {/* 2. شريط البحث "المتحول" */}
                <section className={`mb-16 max-w-2xl mx-auto lg:mx-0 transition-all duration-700 ${isSearching ? 'max-w-4xl scale-105' : ''}`}>
                    <div className={`relative group p-1 rounded-full transition-all duration-500 ${isSearching ? 'bg-gradient-to-r from-[#D4AF37]/50 via-zinc-800 to-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.2)]' : ''}`}>
                        <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-full overflow-hidden">
                            <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-500 ${isSearching ? 'text-[#D4AF37]' : 'text-zinc-500'}`} size={22} />
                            <input 
                                type="text" 
                                placeholder="Unlock the archive..."
                                className="w-full bg-transparent border-none py-6 pl-16 pr-12 outline-none text-xl font-light placeholder:text-zinc-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {isSearching && (
                                <X 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:rotate-90 transition-all cursor-pointer" 
                                    size={20} 
                                />
                            )}
                        </div>
                    </div>
                </section>
                
                {/* 3. منطق عرض المحتوى */}
                {!genreId && !isSearching ? (
                    <div className="space-y-24 animate-in fade-in duration-1000">
                        <MovieRow title="New Releases" fetchUrl="/movie/now_playing" />
                        <MovieRow title="Trending Today" fetchUrl="/trending/movie/day" />
                        <MovieRow title="Top Rated Classics" fetchUrl="/movie/top_rated" />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <header className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37]" />
                                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                                    {searchQuery ? `FOUND IN VAULT: "${searchQuery}"` : "GENRE ARCHIVE"}
                                </h2>
                            </div>
                        </header>

                        {loading ? (
                            <div className="flex flex-col items-center py-40 gap-4">
                                <Loader2 className="text-[#D4AF37] animate-spin" size={60} />
                                <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] animate-pulse">EXTRACTING DATA...</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                                    {movies.map((movie, i) => (
                                        <div key={`${movie.id}-${i}`} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 40}ms` }}>
                                            <MovieCard movie={movie} />
                                        </div>
                                    ))}
                                </div>

                                {movies.length > 0 && (
                                    <div className="flex justify-center mt-24">
                                        <button 
                                            onClick={handleLoadMore} 
                                            disabled={isFetchingMore}
                                            className="group relative px-20 py-5 rounded-full border border-zinc-800 hover:border-[#D4AF37] transition-all overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] group-hover:text-black">
                                                {isFetchingMore ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                                Load More Results
                                            </span>
                                            <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Admin Fab */}
            {userRole === "admin" && (
                <button onClick={() => navigate('/admin')} className="fixed bottom-10 right-10 z-[100] bg-[#D4AF37] text-black p-5 rounded-full shadow-2xl hover:scale-110 transition-transform group">
                    <Settings className="group-hover:rotate-90 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default Archive;