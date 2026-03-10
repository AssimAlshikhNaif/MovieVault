import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { 
    Trash2, Plus, Film, LayoutDashboard, Loader2, Edit, Search, 
    AlertCircle, X, Users, Check, OctagonAlert, Trophy, Crown 
} from "lucide-react";

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "https://via.placeholder.com/500x750?text=No+Poster+Found";

const AdminDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0, serverStatus: "Online" });
    const [editModeId, setEditModeId] = useState(null); 
    const [newMovie, setNewMovie] = useState({ tmdbId: "", title: "", posterPath: "" });

    const fetchData = async () => {
        try {
            setLoading(true);
            const resMovies = await axiosInstance.get("/movies/all");
            setMovies(Array.isArray(resMovies.data) ? resMovies.data : []);
            const resStats = await axiosInstance.get("/admin/stats");
            setStats(resStats.data);
      } catch (err) {
    console.error("Connection Error:", err);
    // إذا كان السيرفر مغلقاً، err.response لن يكون موجوداً
    const msg = err.response?.data?.message || "Server Offline - Please start Backend";
    toast.error(msg);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Updating Gold Vault...");
        try {
            const payload = { tmdbId: parseInt(newMovie.tmdbId), title: newMovie.title, posterPath: newMovie.posterPath };
            if (editModeId) await axiosInstance.put(`/movies/${editModeId}`, payload);
            else await axiosInstance.post("/movies/add", payload);
            
            toast.success("Library Updated Successfully", { id: loadingToast });
            setIsModalOpen(false);
            setEditModeId(null);
            setNewMovie({ tmdbId: "", title: "", posterPath: "" });
            fetchData();
       } catch (err) {
    console.error("Full Error Details:", err); // يطبع تفاصيل الخطأ في الكونسول
    
    // فحص نوع الخطأ لعرض رسالة ذكية للمستخدم
    const errorMessage = err.response?.data?.message 
        || (err.request ? "Server is unreachable. Check if backend is running!" : "An unexpected error occurred");
    
    toast.error(errorMessage, { id: loadingToast });
}
    };

    const handleDelete = (id) => {
        toast.dismiss();
        toast((t) => (
            <div className="flex flex-col gap-4 p-2 bg-[#0a0a0a] text-[#D4AF37]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                        <OctagonAlert size={20} className="text-amber-500" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Permanently delete from vault?</span>
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={() => { toast.dismiss(t.id); confirmDelete(id); }}
                        className="bg-[#D4AF37] px-5 py-2 rounded-xl text-[10px] font-black uppercase text-black hover:bg-white shadow-lg shadow-amber-500/20 transition-all"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        ), { id: "confirm-delete", duration: 6000, style: { background: '#0a0a0a', border: '1px solid #D4AF37', borderRadius: '1.5rem', padding: '16px' } });
    };

    const confirmDelete = async (id) => {
        const deleteToast = toast.loading("Removing...");
        try {
            await axiosInstance.delete(`/movies/${id}`);
            toast.success("Deleted from records", { id: deleteToast });
            fetchData();
       } catch (err) {
    console.error("Delete Error details:", err); // طباعة الخطأ في الكونسول للفحص
    const message = err.response?.data?.message || "Server connection failed";
    toast.error(message, { id: deleteToast });
}
    };

    const filteredMovies = movies.filter(m => (m.title || "").toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000000] text-slate-300 pt-24 px-6 lg:px-20 pb-10 selection:bg-amber-500/30 font-sans">
            <Toaster position="top-right" toastOptions={{ style: { background: '#0a0a0a', color: '#D4AF37', border: '1px solid #D4AF37' }}} />
            <div className="max-w-7xl mx-auto">
                
                {/* Header - Luxury Style */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Crown size={32} className="text-[#D4AF37] mb-2" />
                            <h1 className="text-5xl font-black tracking-tighter text-white italic uppercase">Movie<span className="text-[#D4AF37]">Vault</span></h1>
                        </div>
                        <p className="text-amber-500/50 font-medium tracking-[0.5em] uppercase text-[9px]">The Platinum Collection Management</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search the collection..." 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-amber-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-800 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-[#D4AF37] hover:bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-2xl shadow-amber-500/10 uppercase text-[10px] tracking-widest">
                            <Plus size={18}/> New Asset
                        </button>
                    </div>
                </div>

                {/* Stat Cards - Golden Glow */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <StatCard title="Total Entries" value={stats.totalMovies} icon={<Film size={20}/>} color="from-amber-500/10" />
                    <StatCard title="Active Members" value={stats.totalUsers} icon={<Users size={20}/>} color="from-amber-600/10" />
                    <StatCard title="Node Status" value={stats.serverStatus} icon={<Trophy size={20}/>} color="from-amber-700/10" />
                </div>

                {/* Table - Luxury Table Design */}
                <div className="bg-[#050505] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl shadow-black">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/50 bg-white/[0.01]">
                                    <th className="p-8 text-left">Poster</th>
                                    <th className="p-8 text-left">Title & Era</th>
                                    <th className="p-8 text-center">Reference</th>
                                    <th className="p-8 text-right">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredMovies.map((movie) => (
                                    <tr key={movie.id} className="group hover:bg-amber-500/[0.02] transition-all duration-700">
                                        <td className="p-6 w-32">
                                            <div className="relative w-16 h-24 shrink-0 rounded-xl overflow-hidden shadow-2xl group-hover:shadow-amber-500/20 transition-all">
                                                <img 
                                                    src={movie.poster_path ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_BASE_IMAGE_URL}${movie.poster_path}`) : FALLBACK_IMAGE} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                    alt="" 
                                                />
                                                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <h4 className="font-black text-white group-hover:text-amber-500 transition-colors duration-300 uppercase tracking-tighter text-lg italic">{movie.title}</h4>
                                            <p className="text-[10px] text-slate-600 font-black mt-1 uppercase tracking-widest">{new Date(movie.created_at).getFullYear()} Archive</p>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className="bg-amber-500/5 text-amber-500/60 px-4 py-2 rounded-xl text-[10px] font-mono border border-amber-500/10">
                                                ID-{movie.movie_id}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all duration-500">
                                                <button onClick={() => { setEditModeId(movie.id); setNewMovie({ tmdbId: movie.movie_id, title: movie.title, posterPath: movie.poster_path }); setIsModalOpen(true); }} className="p-4 bg-white/5 text-slate-500 rounded-2xl hover:bg-white hover:text-black transition-all">
                                                    <Edit size={16}/>
                                                </button>
                                                <button onClick={() => handleDelete(movie.id)} className="p-4 bg-white/5 text-slate-500 rounded-2xl hover:bg-amber-600 hover:text-black transition-all">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal - Gold & Dark */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-500">
                    <div className="bg-[#050505] border border-amber-500/20 p-12 rounded-[4rem] w-full max-w-xl shadow-[0_0_100px_rgba(212,175,55,0.05)] relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-700 hover:text-amber-500 transition-colors"><X size={24}/></button>

                        <div className="flex items-center gap-4 mb-12">
                            <div className="bg-amber-500 p-3 rounded-2xl"><Crown size={22} className="text-black"/></div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                                {editModeId ? "Edit Asset" : "New Collection"}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSave} className="space-y-8">
                            <AdminInput label="TMDB Reference Number" type="number" value={newMovie.tmdbId} onChange={e => setNewMovie({...newMovie, tmdbId: e.target.value})} placeholder="e.g. 157336" />
                            <AdminInput label="Asset Title" type="text" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} placeholder="e.g. Interstellar" />
                            <AdminInput label="Resource Path" type="text" value={newMovie.posterPath} onChange={e => setNewMovie({...newMovie, posterPath: e.target.value})} placeholder="e.g. /path.jpg" />
                            
                            <div className="pt-10 flex flex-col gap-4">
                                <button className="w-full bg-[#D4AF37] py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] text-black hover:bg-white transition-all shadow-2xl shadow-amber-500/10">
                                    {editModeId ? "Update Metadata" : "Authorize Entry"}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-slate-700 text-[9px] font-black uppercase tracking-widest hover:text-amber-500 transition-colors">Abort Mission</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#050505] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-700">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${color} to-transparent blur-3xl opacity-30 group-hover:opacity-60 transition-opacity`}></div>
        <div className="flex justify-between items-start relative z-10 mb-8">
            <div className="p-4 bg-white/[0.03] rounded-2xl text-amber-500 group-hover:scale-110 transition-transform duration-700">{icon}</div>
        </div>
        <div className="relative z-10">
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-2">{title}</p>
            <h3 className="text-5xl font-black text-white italic tracking-tighter group-hover:text-amber-500 transition-colors">{value}</h3>
        </div>
    </div>
);

const AdminInput = ({ label, ...props }) => (
    <div className="space-y-3">
        <label className="text-[9px] font-black text-amber-500/40 uppercase tracking-[0.3em] ml-2">{label}</label>
        <input 
            {...props} 
            className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-500/30 focus:bg-white/[0.04] transition-all text-sm text-white placeholder:text-slate-900" 
            required 
        />
    </div>
);

export default AdminDashboard;