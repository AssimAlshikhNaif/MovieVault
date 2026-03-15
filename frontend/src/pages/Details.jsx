import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance, { TMDB_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_URL } from "../api/axiosConfig";
import toast from "react-hot-toast";
import { 
    Loader2, ArrowLeft, Play, X, Clock, Calendar, Crown, ShieldCheck 
} from "lucide-react";

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]); 
    const [newReview, setNewReview] = useState(""); 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState(""); 
    const [showTrailer, setShowTrailer] = useState(false); 

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const movieRes = await axios.get(
                    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`
                );
                setMovie(movieRes.data);

                const trailer = movieRes.data.videos?.results.find(
                    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
                );
                if (trailer) setTrailerUrl(trailer.key);

                const reviewsRes = await axiosInstance.get(`/reviews/${id}`);
                setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("The vault could not retrieve these details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!newReview.trim()) return;
        setSubmitting(true);
        const reviewToast = toast.loading("Recording your royal decree...");
        
        try {
            const response = await axiosInstance.post("/reviews/add", {
                movieId: Number(id),
                comment: newReview
            });

            const reviewToAdd = {
                ...response.data,
                comment: response.data.comment || newReview,    
                username: response.data.username || "You",       
                created_at: response.data.created_at || new Date().toISOString()
            };

            setReviews(prev => [reviewToAdd, ...prev]); 
            setNewReview(""); 
            toast.success("Your review has been immortalized! 👑", { id: reviewToast });
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("The vault is temporarily sealed.", { id: reviewToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 font-sans">
            <Crown className="text-[#D4AF37] animate-bounce" size={50} />
            <div className="flex flex-col items-center">
                <Loader2 className="text-[#D4AF37] animate-spin mb-2" size={30} />
                <p className="text-[#D4AF37] font-black tracking-[0.4em] text-[10px] uppercase">Preparing Private Screening</p>
            </div>
        </div>
    );

    if (!movie) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
            
            
            {showTrailer && trailerUrl && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4">
                    <button 
                        onClick={() => setShowTrailer(false)}
                        className="absolute top-8 right-8 text-white hover:text-[#D4AF37] transition-all p-3 bg-white/5 rounded-full border border-white/10"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                    <div className="w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.2)] border border-[#D4AF37]/20">
                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`} title="Movie Trailer" frameBorder="0" allowFullScreen></iframe>
                    </div>
                </div>
            )}

            <div className="relative w-full min-h-[90vh] lg:h-screen overflow-hidden flex items-end">
                <img 
                    src={`${TMDB_IMAGE_URL}${movie.backdrop_path}`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105" 
                    alt="backdrop" 
                />
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24 flex flex-col lg:flex-row items-center lg:items-end gap-12">
                    <div className="hidden lg:block shrink-0 mb-4">
                        <img 
                            src={movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750'} 
                            className="w-72 rounded-[2.5rem] shadow-2xl border border-white/10" 
                            alt="poster" 
                        />
                    </div>

                    <div className="flex-1 text-center lg:text-left pt-24 lg:pt-0">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group inline-flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase mb-6 bg-black/60 hover:bg-[#D4AF37] hover:text-black px-6 py-3 rounded-full border border-[#D4AF37]/20 transition-all duration-300 backdrop-blur-md"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                            Return to Gallery
                        </button>
                        
                        <h1 className="text-4xl lg:text-7xl font-black uppercase italic mb-6 leading-tight tracking-tighter drop-shadow-2xl">
                            {movie.title}
                        </h1>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                            <div className="bg-[#D4AF37] text-black px-5 py-1.5 rounded-xl text-[10px] font-black italic flex items-center gap-2">
                                <Crown size={12} fill="black" /> {movie.vote_average.toFixed(1)} EXCELLENCE
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-5 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/10 flex items-center gap-2">
                                <Calendar size={12} className="text-[#D4AF37]" /> {new Date(movie.release_date).getFullYear()}
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-5 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/10 flex items-center gap-2">
                                <Clock size={12} className="text-[#D4AF37]" /> {movie.runtime} MIN
                            </div>
                        </div>

                        <p className="text-slate-400 max-w-2xl leading-relaxed text-base lg:text-lg mb-10 font-light italic opacity-90 line-clamp-4 lg:line-clamp-none">
                            {movie.overview}
                        </p>
                        
                        {trailerUrl && (
                            <button 
                                onClick={() => setShowTrailer(true)}
                                className="group bg-white text-black px-12 py-4 rounded-xl font-black flex items-center gap-3 hover:bg-[#D4AF37] hover:text-white transition-all transform hover:scale-105 mx-auto lg:mx-0 shadow-xl uppercase tracking-widest text-[10px]"
                            >
                                <Play size={16} fill="currentColor" /> Preview Masterpiece
                            </button>
                        )}
                    </div>
                </div>
            </div>

            
            <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                    <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 sticky top-32 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Crown className="text-[#D4AF37]" size={18} />
                            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">Guestbook</h2>
                        </div>
                        {localStorage.getItem("token") ? (
                            <form onSubmit={handleAddReview} className="space-y-4">
                                <textarea 
                                    className="w-full bg-black border border-white/5 rounded-[1.5rem] p-5 text-white outline-none focus:border-[#D4AF37]/50 min-h-[150px] transition-all placeholder:text-slate-700 resize-none text-sm"
                                    placeholder="Leave your signature mark..."
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-white disabled:opacity-50 text-[10px] tracking-widest"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <>SUBMIT DECREE</>}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
                                <p className="text-slate-500 text-[10px] font-black mb-4 uppercase tracking-widest">Membership Required</p>
                                <button onClick={() => navigate('/login')} className="text-[#D4AF37] border border-[#D4AF37]/50 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-[#D4AF37] transition-all">Claim Your Key</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="flex items-baseline gap-3 mb-12">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Critiques</h2>
                        <span className="text-[#D4AF37] font-serif italic text-xl opacity-50">/{reviews.length}</span>
                    </div>
                    {reviews.length === 0 ? (
                        <div className="py-24 text-center bg-[#0a0a0a] rounded-[3rem] border border-white/5">
                            <Crown className="mx-auto mb-4 text-white/5" size={60} />
                            <p className="text-slate-600 font-black uppercase tracking-widest text-[9px]">The hall is silent.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {reviews.map((rev, index) => (
                                <div key={rev.id || `review-${index}`} className="group relative bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#886e1c] flex items-center justify-center text-black font-black text-lg">
                                                {rev.username ? rev.username[0].toUpperCase() : "V"}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-xl uppercase italic tracking-tighter text-white">{rev.username || "Anonymous"}</span>
                                                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                                                </div>
                                                <div className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest opacity-60">Royal Member</div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full">
                                            {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "Present"}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed text-lg font-light italic pl-4 border-l border-[#D4AF37]/20">
                                        "{rev.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;