import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
  userRole?: "student" | "admin";
}

export const Header = ({
  isLoggedIn: propLoggedIn,
  onLogout,
  userRole: propRole,
}: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "admin">("student");

  // Initialize login state and role
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(propLoggedIn ?? !!token);

    const roleFromStorage = localStorage.getItem("role") as
      | "student"
      | "admin"
      | null;

    setUserRole(propRole ?? roleFromStorage ?? "student");
  }, [propLoggedIn, propRole]);

  const navLinks = isLoggedIn
    ? userRole === "admin"
      ? [
          { path: "/admin", label: "Dashboard" },
          { path: "/admin/exams", label: "Manage Exams" },
          { path: "/admin/results", label: "Results" },
        ]
      : [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/exams", label: "Exams" },
          { path: "/results", label: "My Results" },
          { path: "/feedback", label: "Feedback" }, // ✅ Added
        ]
    : [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    onLogout?.();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md group-hover:shadow-lg transition-shadow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">ExamPro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={
                  location.pathname === link.path ? "secondary" : "ghost"
                }
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Profile */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border hover:bg-transparent"
                onClick={() => navigate("/profile")}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:bg-transparent hover:text-black"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="container py-4 space-y-2">
              {/* Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={
                      location.pathname === link.path ? "secondary" : "ghost"
                    }
                    className="w-full justify-start"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}

              {/* Auth Section */}
              <div className="pt-2 border-t border-border space-y-2">
                {isLoggedIn ? (
                  <>
                    {/* Profile */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 rounded-lg"
                      onClick={() => {
                        navigate("/profile");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>Profile</span>
                    </Button>

                    {/* Logout */}
                    <Button
                      variant="ghost"
                      className="w-full flex justify-center text-black hover:bg-transparent hover:text-black"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="hero" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
