import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Users, TrendingUp, Trash2, Eye, BarChart3 } from "lucide-react";
import { toast } from "sonner";

type Exam = {
  _id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  totalQuestions: number;
  totalPoints: number;
  isActive: boolean;
  createdAt: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [exams, setExams] = useState<Exam[]>([]);

  const fetchExams = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${BACKEND_URL}/api/exams`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch exams");

      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load exams");
      setExams([]);
    }
  }, [BACKEND_URL]);

  // SECURITY + AUTO LOGOUT (5 min inactivity)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "admin") {
      navigate("/adminlogin", { replace: true });
      return;
    }

    fetchExams();

    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast("Logged out due to inactivity");
        navigate("/adminlogin", { replace: true });
      }, 5 * 60 * 1000); // 5 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate, fetchExams]);

  const handleToggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const exam = exams.find((e) => e._id === id);
      if (!exam) return;

      const res = await fetch(`${BACKEND_URL}/api/exams/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update status");

      setExams((prev) =>
        prev.map((e) => (e._id === id ? { ...e, isActive: !e.isActive } : e))
      );
      toast.success("Exam status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/exams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete exam");

      setExams((prev) => prev.filter((e) => e._id !== id));
      toast.success("Exam deleted");
    } catch {
      toast.error("Failed to delete exam");
    }
  };

  const stats = [
    {
      icon: BookOpen,
      label: "Total Exams",
      value: exams.length,
      change: "+2 this week",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Users,
      label: "Total Students",
      value: "1,234",
      change: "+48 this week",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: "Submissions",
      value: exams.reduce((acc, e) => acc + (e.totalPoints || 0), 0),
      change: "+120 today",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: BarChart3,
      label: "Avg. Score",
      value: "72%",
      change: "+3% this month",
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn
        userRole="admin"
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/adminlogin", { replace: true });
        }}
      />

      <main className="container py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6">
                <div
                  className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-success mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Exams Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>All Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam._id}>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{exam.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            exam.difficulty === "easy"
                              ? "border-success/30 text-success"
                              : exam.difficulty === "medium"
                              ? "border-warning/30 text-warning"
                              : "border-destructive/30 text-destructive"
                          }
                        >
                          {exam.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{exam.totalQuestions}</TableCell>
                      <TableCell>{exam.duration} min</TableCell>
                      <TableCell>
                        <Badge
                          variant={exam.isActive ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(exam._id)}
                        >
                          {exam.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExam(exam._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
