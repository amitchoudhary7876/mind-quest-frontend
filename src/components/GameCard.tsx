import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: "cyan" | "magenta" | "purple";
  players?: string;
  featured?: boolean;
  emoji?: string;
}

const gradientStyles = {
  cyan: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60",
  magenta: "from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/60",
  purple: "from-jungle-amber/20 to-jungle-amber/5 border-jungle-amber/30 hover:border-jungle-amber/60",
};

const GameCard = ({
  title,
  description,
  icon: Icon,
  path,
  gradient,
  players,
  featured = false,
  emoji,
}: GameCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-xl ${gradientStyles[gradient]} ${
        featured ? "col-span-full lg:col-span-2" : ""
      }`}
    >
      <Link to={path} className="block p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">
            {emoji || "🎮"}
          </div>
          {featured && (
            <span className="px-3 py-1 text-xs font-bold bg-secondary text-secondary-foreground rounded-full">
              🔥 FEATURED
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>

        <div className="flex items-center justify-between">
          {players && (
            <span className="text-sm text-muted-foreground">
              <span className="text-primary font-bold">🐾 {players}</span> exploring now
            </span>
          )}
          <div className="flex items-center gap-2 text-primary font-bold group">
            Play Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Decorative glow */}
      <div
        className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${
          gradient === "cyan"
            ? "bg-primary"
            : gradient === "magenta"
            ? "bg-secondary"
            : "bg-jungle-amber"
        }`}
      />
    </motion.div>
  );
};

export default GameCard;
