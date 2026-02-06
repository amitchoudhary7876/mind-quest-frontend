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
}

const gradientStyles = {
  cyan: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60",
  magenta: "from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/60",
  purple: "from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 hover:border-neon-purple/60",
};

const iconStyles = {
  cyan: "bg-primary/20 text-primary",
  magenta: "bg-secondary/20 text-secondary",
  purple: "bg-neon-purple/20 text-neon-purple",
};

const GameCard = ({
  title,
  description,
  icon: Icon,
  path,
  gradient,
  players,
  featured = false,
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
          <div className={`p-4 rounded-xl ${iconStyles[gradient]}`}>
            <Icon className="w-8 h-8" />
          </div>
          {featured && (
            <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              FEATURED
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>

        <div className="flex items-center justify-between">
          {players && (
            <span className="text-sm text-muted-foreground">
              <span className="text-green-400 font-medium">{players}</span> playing now
            </span>
          )}
          <div className="flex items-center gap-2 text-primary font-medium group">
            Play Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Decorative glow */}
      <div
        className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 ${
          gradient === "cyan"
            ? "bg-primary"
            : gradient === "magenta"
            ? "bg-secondary"
            : "bg-neon-purple"
        }`}
      />
    </motion.div>
  );
};

export default GameCard;
