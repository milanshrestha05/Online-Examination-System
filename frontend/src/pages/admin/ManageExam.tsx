import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { ExamListItem, Question } from '@/types/exam';

interface BackendExam {
  _id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  isActive: boolean;
  questions?: Question[];
}

const ManageExam = () => {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<
    Partial<ExamListItem & { questions: Question[] }>
  >({ questions: [] });
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------- Fetch Exams ---------------- */
  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exams`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      const mapped: ExamListItem[] = (data?.exams as BackendExam[] || []).map(
        (exam) => ({
          id: exam._id ?? '',
          title: exam.title,
          description: exam.description,
          category: exam.category,
          difficulty: exam.difficulty,
          duration: exam.duration,
          isActive: exam.isActive,
          totalQuestions: exam.questions?.length || 0,
          totalPoints: exam.questions?.reduce((sum, q) => sum + (q.points || 1), 0) || 0,
          questions: exam.questions ?? [],
        })
      );
      setExams(mapped);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Fetch exams error:', message);
      toast.error('Error fetching exams: ' + message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  /* ---------------- Form State Handling ---------------- */
  const handleChange = (
    key: keyof typeof formData,
    value: string | number | 'easy' | 'medium' | 'hard'
  ) => setFormData({ ...formData, [key]: value });

  /* ---------------- Question Handlers ---------------- */
  const addQuestion = () =>
    setFormData({
      ...formData,
      questions: [
        ...(formData.questions || []),
        { id: Date.now().toString(), text: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 },
      ],
    });

  const updateQuestion = (index: number, key: keyof Question, value: string | number) => {
    const updated = [...(formData.questions || [])];
    updated[index] = { ...updated[index], [key]: value } as Question;
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...(formData.questions || [])];
    updated[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index: number) => {
    const updated = [...(formData.questions || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, questions: updated });
  };

  /* ---------------- Create or Update Exam ---------------- */
  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    const backendQuestions = (formData.questions || []).map((q) => ({
      question: q.text,
      options: q.options,
      correctAnswer: String(q.correctAnswer),
      points: q.points || 1,
    }));

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty || 'medium',
      duration: formData.duration || 30,
      questions: backendQuestions,
    };

    try {
      const url = editingId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/exams/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/exams`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save exam');

      toast.success(editingId ? 'Exam updated' : 'Exam created');

      setFormData({ questions: [] });
      setEditingId(null);
      fetchExams();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Handle submit error:', message);
      toast.error('Error: ' + message);
    }
  };

  /* ---------------- Edit / Delete / Toggle ---------------- */
  const handleEdit = (exam: ExamListItem) => {
    setEditingId(exam.id);
    setFormData({ ...exam, questions: exam.questions || [] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exams/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Exam deleted');
      fetchExams();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Delete exam error:', message);
      toast.error('Error: ' + message);
    }
  };

  const toggleActive = async (exam: ExamListItem) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exams/${exam.id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(`Exam ${exam.isActive ? 'deactivated' : 'activated'}`);
      fetchExams();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Toggle exam error:', message);
      toast.error('Error: ' + message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Exams</h1>

        {/* ----- Exam Form ----- */}
        <Card className="mb-8 p-4">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Exam' : 'Create New Exam'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration || 30}
              onChange={(e) => handleChange('duration', Number(e.target.value))}
            />
            <Input
              type="text"
              placeholder="Category"
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
            />
            <Select
              onValueChange={(val) =>
                handleChange('difficulty', val as 'easy' | 'medium' | 'hard')
              }
              value={formData.difficulty || 'medium'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            {/* ----- Questions ----- */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Questions</h2>
              {(formData.questions || []).map((q, qIndex) => (
                <Card key={q.id || qIndex} className="p-4 border border-border/50 bg-card">
                  <Input
                    placeholder={`Question ${qIndex + 1}`}
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt, oIndex) => (
                      <Input
                        key={oIndex}
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      />
                    ))}
                  </div>
                  <Input
                    placeholder="Correct Answer (index 0-3)"
                    type="number"
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', Number(e.target.value))}
                    className="mt-2"
                  />
                  <Input
                    type="number"
                    placeholder="Points"
                    value={q.points}
                    onChange={(e) => updateQuestion(qIndex, 'points', Number(e.target.value))}
                    className="mt-2"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    className="mt-2 flex items-center gap-1"
                  >
                    <Minus size={16} /> Remove Question
                  </Button>
                </Card>
              ))}
              <Button size="sm" onClick={addQuestion} className="flex items-center gap-1">
                <Plus size={16} /> Add Question
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit}>{editingId ? 'Update Exam' : 'Create Exam'}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({ questions: [] });
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ----- Exam List ----- */}
        {loading && <p>Loading exams...</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 border border-border/50 bg-card">
                <CardHeader className="flex justify-between items-start">
                  <CardTitle>{exam.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      exam.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }
                  >
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{exam.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Button size="sm" onClick={() => handleEdit(exam)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(exam.id)}>
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                    <Button
                      size="sm"
                      variant={exam.isActive ? 'outline' : 'default'}
                      onClick={() => toggleActive(exam)}
                    >
                      {exam.isActive ? (
                        <>
                          <XCircle className="w-4 h-4 mr-1" /> Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" /> Activate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageExam;
