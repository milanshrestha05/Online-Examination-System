import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ExamCard } from '@/components/exam/ExamCard';
import { motion } from 'framer-motion';
import { ExamListItem } from '@/types/exam'; // summary type for frontend

/* ---------- Backend API Type ---------- */
interface BackendExam {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  totalQuestions: number;
  totalPoints: number;
  isActive: boolean;
}

const ExamList = () => {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT token

        const response = await fetch('http://localhost:5000/api/exams', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // required for protected route
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch exams: ${response.status}`);
        }

        const rawData = await response.json();

        // Map backend exams to frontend summary type
        const data: ExamListItem[] = (rawData as BackendExam[]).map((exam) => ({
          id: exam._id ?? exam.id ?? '',
          title: exam.title,
          description: exam.description,
          category: exam.category,
          difficulty: exam.difficulty,
          duration: exam.duration,
          totalQuestions: exam.totalQuestions,
          totalPoints: exam.totalPoints,
          isActive: exam.isActive,
        }));

        setExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const categories = [
    'all',
    ...Array.from(new Set(exams.map((exam) => exam.category))),
  ];

  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'all' || exam.category === category;
    const matchesDifficulty = difficulty === 'all' || exam.difficulty === difficulty;

    return matchesSearch && matchesCategory && matchesDifficulty && exam.isActive;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn onLogout={() => {}} />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Available Exams</h1>
          <p className="text-muted-foreground">
            Browse and start exams to test your knowledge
          </p>
        </motion.div>

        {loading && (
          <p className="text-center text-muted-foreground">Loading exams...</p>
        )}

        {!loading && filteredExams.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam, index) => (
              <ExamCard key={exam.id} exam={exam} index={index} />
            ))}
          </div>
        )}

        {!loading && filteredExams.length === 0 && (
          <p className="text-center text-muted-foreground">
            No exams found.
          </p>
        )}
      </main>
    </div>
  );
};

export default ExamList;
