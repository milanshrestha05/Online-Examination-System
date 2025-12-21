import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate, Variants } from "framer-motion";
import { GraduationCap, Clock, Shield, BarChart3, Users, Award, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";

/* ---------------- Animations ---------------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

/* ---------------- Animated Number ---------------- */
const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

/* ---------------- Static Features ---------------- */
const features = [
  { icon: Clock, title: "Timed Assessments", description: "Real-time countdown timers ensure fair testing." },
  { icon: Shield, title: "Secure Testing", description: "Advanced anti-cheating & secure submissions." },
  { icon: BarChart3, title: "Instant Results", description: "Immediate scores with deep performance analytics." },
  { icon: Users, title: "Multi-User Roles", description: "Students & admins with role-based access." },
];

/* ---------------- Types ---------------- */
type Stat = { value: number; label: string; suffix?: string };
type Testimonial = { name: string; role: string; quote: string };

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "admin">("student");

  const [stats, setStats] = useState<Stat[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- Auth State ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const role = localStorage.getItem("role") as "student" | "admin" | null;
    if (role) setUserRole(role);
  }, []);

  /* ---------------- Fetch Stats ---------------- */
  useEffect(() => {
    setLoadingStats(true);
    fetch(`${BACKEND_URL}/api/stats`)
      .then((res) => res.json())
      .then((data) => setStats(Array.isArray(data?.stats) ? data.stats : [])) // ✅ safely extract array
      .catch(() => setStats([]))
      .finally(() => setLoadingStats(false));
  }, [BACKEND_URL]);

  /* ---------------- Fetch Testimonials ---------------- */
  useEffect(() => {
    setLoadingTestimonials(true);
    fetch(`${BACKEND_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => setTestimonials(Array.isArray(data?.testimonials) ? data.testimonials : [])) // ✅ safely extract array
      .catch(() => setTestimonials([]))
      .finally(() => setLoadingTestimonials(false));
  }, [BACKEND_URL]);

  const heroLink = isLoggedIn ? (userRole === "admin" ? "/admin" : "/dashboard") : "/register";
  const heroLabel = isLoggedIn ? "Go to Dashboard" : "Get Started Free";

  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <Header isLoggedIn={isLoggedIn} userRole={userRole} />

      {/* ---------------- Hero ---------------- */}
      <section className="container py-28 relative">
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} className="space-y-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Award className="h-4 w-4" />
              Trusted by learners
            </span>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-tight">
              Smarter Exams.<br />
              <span className="text-gradient">Better Results.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              ExamPro is a next-gen online examination platform with secure testing, real-time analytics, and better learning outcomes.
            </p>

            <div className="flex gap-4">
              <Link to={heroLink}>
                <Button size="xl" variant="hero" className="group">
                  {heroLabel}
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/exams">
                <Button size="xl" variant="outline">Browse Exams</Button>
              </Link>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="hidden lg:block">
            <div className="rounded-3xl bg-card/80 backdrop-blur border p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-success">85%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[85%] gradient-primary rounded-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="container py-16">
        {loadingStats ? (
          <p className="text-center text-muted-foreground">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 rounded-2xl bg-card/80 backdrop-blur border p-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-extrabold text-gradient">
                  <AnimatedNumber value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-extrabold mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground">Powerful tools designed for students and institutions.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-card border hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Loved by Students & Educators</h2>
          <p className="text-muted-foreground">Feedback from users.</p>
        </div>

        {loadingTestimonials ? (
          <p className="text-center text-muted-foreground">Loading feedback...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground">No feedback yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-card border">
                <p className="text-muted-foreground mb-4">“{t.quote}”</p>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="container py-24">
        <div className="rounded-3xl gradient-primary p-16 text-center">
          <h2 className="text-4xl font-extrabold text-primary-foreground mb-4">Start Examining Smarter Today</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10">Join thousands of learners achieving better results with ExamPro.</p>
          <Link to={heroLink}>
            <Button size="xl" className="bg-background text-foreground">
              {heroLabel}
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t py-10">
        <div className="container text-center text-sm text-muted-foreground">© 2025 ExamPro. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Index;
