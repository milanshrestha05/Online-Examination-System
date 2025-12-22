import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-primary/20 flex items-center justify-center px-4 overflow-hidden"
      role="main"
    >
      {/* Decorative shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-lg"
        role="alert"
        aria-live="assertive"
      >
        <div className="inline-flex items-center justify-center mb-6 w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto">
          <AlertCircle className="w-10 h-10" aria-hidden="true" />
        </div>

        <h1 className="text-7xl font-extrabold text-gradient mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Oops! The page{" "}
          <span className="font-mono" aria-label={`Pathname ${location.pathname}`}>
            {location.pathname}
          </span>{" "}
          does not exist.
        </p>

        <Link to="/">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Return to Home Page"
          >
            Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
