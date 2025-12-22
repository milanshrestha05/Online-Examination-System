import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // Only allow admin users
      if (data.user.role !== "admin") {
        toast.error("Access denied. Admins only.");
        return;
      }

      // Save token & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");
      navigate("/admin");
    } catch {
      toast.error("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gradient">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
            <div className="relative">
              <Input
                id="admin-email"
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                autoComplete="off"
                className="pr-10"
              />
              <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Decorative circles */}
        <div className="absolute top-[-10%] left-[-10%] w-36 h-36 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-36 h-36 bg-accent/20 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};

export default AdminLogin;
