import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Coins, User, Menu, X, Gamepad2 } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Games", path: "/games" },
    { name: "Social", path: "/social" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="container mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              Mind Quest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary neon-text-cyan"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-foreground">1,250</span>
            </div>
            <Link
              to="/auth"
              className="btn-neon text-sm py-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-card p-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium py-2 ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="btn-neon text-center mt-2"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
