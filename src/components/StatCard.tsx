import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down";
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, change, trend, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {change && (
            <span
              className={`text-sm font-medium ${
                trend === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend === "up" ? "+" : "-"}{change}
            </span>
          )}
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="font-display text-3xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
