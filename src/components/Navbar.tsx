import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGameProgress } from "../hooks/useGameProgress";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { coins } = useGameProgress();

  // Define nav links with visibility rules
  const allLinks = [
    { name: "🗺️ Dashboard", path: "/dashboard", protected: true },
    { name: "🎮 Games", path: "/games", protected: true },
    { name: "🐾 Pack", path: "/social", protected: true },
  ];

  const visibleLinks = allLinks.filter(link => {
    if (user) return true; // Show all to logged in? Or restrict Home? Let's show all.
    return !link.protected; // Only public links if not logged in
  });

  const isActive = (path: string) => location.pathname === path;



  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

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
            <div className="text-3xl">🌿</div>
            <span className="font-display text-xl gradient-text hidden sm:block">
              Mind Quest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary jungle-glow-green"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
                  <span className="text-lg">💰</span>
                  <span className="font-bold text-secondary">{coins.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-jungle text-sm py-2"
              >
                Join the Pack
              </Link>
            )}
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
              {visibleLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-semibold py-2 ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                 <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                         <span className="text-lg">💰</span>
                         <span className="font-bold text-secondary">{coins.toLocaleString()}</span>
                    </div>
                    <button onClick={handleLogout} className="text-red-400 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                 </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="btn-jungle text-center mt-2"
                >
                  Join the Pack
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
