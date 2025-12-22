import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/user/Index";
import Dashboard from "./pages/user/Dashboard";
import ExamList from "./pages/user/ExamList";
import TakeExam from "./pages/user/TakeExam";
import ExamResult from "./pages/user/ExamResult";
import Results from "./pages/user/Results";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import NotFound from "./pages/user/NotFound";
import Feedback from "./pages/user/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/exam/:id" element={<TakeExam />} />
          <Route path="/exam-result" element={<ExamResult />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
