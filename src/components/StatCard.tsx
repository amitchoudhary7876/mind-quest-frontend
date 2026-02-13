import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down";
  delay?: number;
  emoji?: string;
}

const StatCard = ({ title, value, icon: Icon, change, trend, delay = 0, emoji }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">
            {emoji || "📊"}
          </div>
          {change && (
            <span
              className={`text-sm font-bold ${
                trend === "up" ? "text-primary" : "text-destructive"
              }`}
            >
              {trend === "up" ? "+" : "-"}{change}
            </span>
          )}
        </div>

        <h3 className="text-muted-foreground text-sm font-bold mb-1">{title}</h3>
        <p className="font-display text-3xl">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
