import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Mail, User, Briefcase, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/components/ui/use-toast";

const Feedback = () => {
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, quote, rating }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Feedback submitted",
        description: "We appreciate your time and thoughts!",
      });

      setName("");
      setRole("");
      setEmail("");
      setQuote("");
      setRating(0);
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />

      <section className="container py-24 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-10 shadow-2xl"
        >
          {/* Left Info Panel */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight">
              We value your <span className="text-primary">feedback</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Help us improve ExamPro by sharing your honest experience.
              Your voice matters.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Role */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                id="role"
                name="role"
                type="text"
                autoComplete="organization-title"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role / Profession"
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <textarea
                id="feedback"
                name="feedback"
                autoComplete="off"
                required
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Rating */}
            <div className="flex gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl text-lg shadow-lg"
              disabled={rating === 0 || loading}
            >
              {loading ? "Submitting..." : "Send Feedback"}
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default Feedback;
