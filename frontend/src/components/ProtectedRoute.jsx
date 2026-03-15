import { Navigate } from "react-router-dom";

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

export default ProtectedRoute;