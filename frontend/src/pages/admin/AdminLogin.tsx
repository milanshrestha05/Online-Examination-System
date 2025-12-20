import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setLoading(false);
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        toast.success('Login successful!');
        navigate('/admin'); // redirect to AdminDashboard
      } else {
        toast.error('Invalid credentials');
      }
    }, 1000);
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
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="admin@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
              <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type="password"
                placeholder="********"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
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
