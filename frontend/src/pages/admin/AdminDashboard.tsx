import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { mockExams, mockResults } from '@/data/mockExams';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [exams, setExams] = useState(mockExams);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    duration: 30,
    category: 'Programming',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Exams',
      value: exams.length,
      change: '+2 this week',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: '1,234',
      change: '+48 this week',
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: TrendingUp,
      label: 'Submissions',
      value: mockResults.length * 50,
      change: '+120 today',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: BarChart3,
      label: 'Avg. Score',
      value: '72%',
      change: '+3% this month',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  const handleCreateExam = () => {
    if (!newExam.title || !newExam.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const exam = {
      id: crypto.randomUUID(),
      ...newExam,
      totalQuestions: 0,
      totalPoints: 0,
      questions: [],
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setExams([...exams, exam]);
    setIsCreateOpen(false);
    setNewExam({
      title: '',
      description: '',
      duration: 30,
      category: 'Programming',
      difficulty: 'medium',
    });
    toast.success('Exam created successfully!');
  };

  const handleToggleActive = (id: string) => {
    setExams(
      exams.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    );
    toast.success('Exam status updated');
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
    toast.success('Exam deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn userRole="admin" onLogout={() => {}} />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage exams and monitor performance</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>
                  Fill in the basic details to create a new exam
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="e.g., JavaScript Basics"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Brief description of the exam..."
                    value={newExam.description}
                    onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (min)</label>
                    <Input
                      type="number"
                      value={newExam.duration}
                      onChange={(e) =>
                        setNewExam({ ...newExam, duration: parseInt(e.target.value) || 30 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select
                      value={newExam.difficulty}
                      onValueChange={(v) =>
                        setNewExam({ ...newExam, difficulty: v as 'easy' | 'medium' | 'hard' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateExam}>Create Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6">
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{exam.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            exam.difficulty === 'easy'
                              ? 'border-success/30 text-success'
                              : exam.difficulty === 'medium'
                              ? 'border-warning/30 text-warning'
                              : 'border-destructive/30 text-destructive'
                          }
                        >
                          {exam.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{exam.totalQuestions}</TableCell>
                      <TableCell>{exam.duration} min</TableCell>
                      <TableCell>
                        <Badge
                          variant={exam.isActive ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(exam.id)}
                        >
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExam(exam.id)}
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
