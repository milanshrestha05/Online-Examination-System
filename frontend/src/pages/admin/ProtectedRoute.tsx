import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type Props = {
  children: JSX.Element;
  adminOnly?: boolean; // true for admin routes, false for user routes
};

type JwtPayload = {
  role: string;
  exp: number; // expiration time in seconds
};

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const token = localStorage.getItem("token");

  // No token → redirect to login
  if (!token) {
    return <Navigate to={adminOnly ? "/adminlogin" : "/login"} replace />;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);

    // Token expired → remove token & redirect
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to={adminOnly ? "/adminlogin" : "/login"} replace />;
    }

    // Admin-only route check
    if (adminOnly) {
      if (decoded.role !== "admin") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/adminlogin" replace />;
      }
    } else {
      // User route check → prevent admin from accessing user pages
      if (decoded.role === "admin") {
        return <Navigate to="/admin" replace />;
      }
    }

    // Authorized → render children
    return children;
  } catch (err) {
    console.error("ProtectedRoute error:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to={adminOnly ? "/adminlogin" : "/login"} replace />;
  }
};

export default ProtectedRoute;
