import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          role,
          email,
          quote,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSubmitted(true);
      setName("");
      setRole("");
      setEmail("");
      setQuote("");
      setRating(0);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container py-24 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-card/80 backdrop-blur p-10 shadow-xl"
        >
          <h1 className="text-4xl font-extrabold mb-4 text-center">
            Share Your Feedback
          </h1>
          <p className="text-muted-foreground text-center mb-10">
            Your experience helps us improve ExamPro.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-semibold text-success">
                Thank you for your feedback! 
              </h2>
              <p className="text-muted-foreground">
                Your feedback has been saved successfully.
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Feedback
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 font-medium">Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder=""
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block mb-2 font-medium">
                  Your Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Message..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Rating */}
              <div className="text-center pt-2">
                <p className="mb-3 font-medium">Rate your experience</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-center text-sm text-destructive">
                  {error}
                </p>
              )}

              {/* Submit */}
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  variant="hero"
                  disabled={rating === 0 || loading}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Feedback;
