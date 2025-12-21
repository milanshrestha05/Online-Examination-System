import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Shield, Calendar } from "lucide-react";

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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error loading profile"
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [BACKEND_URL, navigate, token]);

  const handleUpdate = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, password: password || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      setPassword("");
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header
        isLoggedIn
        onLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      />

      <main className="container py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl shadow-2xl p-10"
        >
          {/* Header */}
          <div className="flex items-center gap-5 mb-10">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {editMode ? (
              <>
                <InputField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputField
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </>
            ) : (
              <>
                <ProfileRow icon={User} label="Name" value={user.name} />
                <ProfileRow icon={Mail} label="Email" value={user.email} />
                <ProfileRow icon={Shield} label="Role" value={user.role} />
                <ProfileRow
                  icon={Calendar}
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap gap-3">
            {editMode ? (
              <>
                <Button onClick={handleUpdate}>Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setName(user.name);
                    setPassword("");
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
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

const ProfileRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between border-b border-border pb-4">
    <div className="flex items-center gap-3 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

const InputField = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

export default Profile;
