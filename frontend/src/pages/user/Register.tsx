import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Server not responding");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    isLoading ||
    !name ||
    !email ||
    !password ||
    password !== confirmPassword;

  return (
    <div className="min-h-screen gradient-hero">
      <Header />

      <main className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-lg">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">
                Create an account
              </CardTitle>
              <CardDescription>
                Get started with ExamPro today
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-input"
                  />
                  <span className="text-muted-foreground">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isDisabled}
                >
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
