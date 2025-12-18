import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  Variants,
} from 'framer-motion';
import {
  GraduationCap,
  Clock,
  Shield,
  BarChart3,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], 
    },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], 
    });

    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

const features = [
  {
    icon: Clock,
    title: 'Timed Assessments',
    description: 'Real-time countdown timers ensure fair and consistent testing.',
  },
  {
    icon: Shield,
    title: 'Secure Testing',
    description: 'Advanced anti-cheating and secure exam submissions.',
  },
  {
    icon: BarChart3,
    title: 'Instant Results',
    description: 'Immediate scores with detailed performance analytics.',
  },
  {
    icon: Users,
    title: 'Multi-User Roles',
    description: 'Students & admins with role-based access control.',
  },
];

const stats = [
  { value: 10000, label: 'Active Students', suffix: '+' },
  { value: 500, label: 'Exams Created', suffix: '+' },
  { value: 98, label: 'Success Rate', suffix: '%' },
  { value: 24, label: 'Availability', suffix: '/7' },
];

const testimonials = [
  {
    name: 'Aarav Patel',
    role: 'Computer Science Student',
    quote:
      'ExamPro completely changed how I prepare for exams. The instant feedback is a game changer.',
  },
  {
    name: 'Sarah Johnson',
    role: 'University Lecturer',
    quote:
      'Creating and managing exams is incredibly smooth. My students love the experience.',
  },
  {
    name: 'Mohammed Ali',
    role: 'Engineering Student',
    quote:
      'The analytics helped me identify weak areas and improve quickly.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <Header />
      <section className="relative container py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 bg-accent/30 blur-3xl" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp} className="space-y-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Award className="h-4 w-4" />
              Trusted by 10,000+ learners
            </span>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-tight">
              Smarter Exams. <br />
              <span className="text-gradient animate-gradient">
                Better Results.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              ExamPro is a next-generation online examination platform built
              for secure testing, real-time analytics, and better learning outcomes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="xl" variant="hero" className="group">
                  Get Started Free
                  <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/exams">
                <Button size="xl" variant="outline">
                  Browse Exams
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="hidden lg:block"
          >
            <div className="backdrop-blur-xl bg-card/80 border border-border/60 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">JavaScript Fundamentals</h3>
                      <p className="text-sm text-muted-foreground">
                        10 Questions • 30 Minutes
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-success">85%</span>
                </div>

                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[85%] gradient-primary rounded-full" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xl font-bold">2</div>
                    <div className="text-xs text-muted-foreground">Wrong</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xl font-bold">22m</div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 rounded-2xl bg-card/80 backdrop-blur border border-border/60 p-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-extrabold text-gradient">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-extrabold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground">
            Powerful tools designed for students and institutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold mb-4">
            Loved by Students & Educators
          </h2>
          <p className="text-muted-foreground">
            Real feedback from real users.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:shadow-primary/10"
            >
              <p className="text-muted-foreground mb-4">“{t.quote}”</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container py-24">
        <div className="rounded-3xl gradient-primary p-16 text-center">
          <h2 className="text-4xl font-extrabold text-primary-foreground mb-4">
            Start Examining Smarter Today
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10">
            Join thousands of learners achieving better results with ExamPro.
          </p>
          <Link to="/dashboard">
            <Button size="xl" className="bg-background text-foreground hover:bg-background/90">
              Launch Dashboard
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">ExamPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ExamPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
