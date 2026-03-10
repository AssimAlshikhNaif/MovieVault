import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // استيراد المكتبة
import Header from "./components/header/Header";
import Archive from "./pages/Archive";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Details from "./pages/Details";
import Myvault from "./pages/MyVault";
import Footer from "./components/footer/Footer";

// مكون حماية المسارات
const ProtectedRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate replace to="/login" />;
    }

    if (roleRequired && userRole !== roleRequired) {
        return <Navigate replace to="/" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>

            <Toaster 
                position="top-right" 
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#0f172a', 
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '16px',
                        borderRadius: '16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#ef4444', 
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <div className="bg-[#020617] min-h-screen text-white flex flex-col selection:bg-red-600 selection:text-white">
                <Header />
                
                <main className="flex-1 w-full overflow-x-hidden"> 
                    <Routes>
                        <Route path="/" element={<Archive />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/movie/:id" element={<Details />} />

                        <Route 
                            path="/myvault" 
                            element={
                                <ProtectedRoute>
                                    <Myvault />
                                </ProtectedRoute>
                            } 
                        />

                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute roleRequired="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>

                <Footer />
               
            </div>
        </BrowserRouter>
    );
}

export default App;