import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch user profile
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || 'Failed to load profile');
        }

        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error loading profile');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [BACKEND_URL, navigate, token]);

  // Update profile handler
  const handleUpdate = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, password: password || undefined }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      setUser(data.user);
      setPassword('');
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn
        onLogout={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      />

      <main className="container py-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-xl p-8"
        >
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <div className="space-y-4">
            {editMode ? (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-muted-foreground font-bold text-black">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-muted-foreground font-bold text-black">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            ) : (
              <>
                <ProfileRow label="Name" value={user.name} />
                <ProfileRow label="Email" value={user.email} />
                <ProfileRow label="Role" value={user.role} />
                <ProfileRow
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
              </>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            {editMode ? (
              <>
                <Button onClick={handleUpdate}>Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setName(user.name);
                    setPassword('');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Profile;
