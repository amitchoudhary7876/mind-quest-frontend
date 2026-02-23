import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) || 0 : value;
  const isPercentage = typeof value === 'string' && value.includes('%');
  
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: 1.5
  });
  
  const displayValue = useTransform(springValue, (latest) => {
    const rounded = Math.floor(latest);
    if (isPercentage) return `${rounded}%`;
    return rounded.toLocaleString();
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        springValue.set(numericValue);
      }, (delay * 1000) + 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, numericValue, springValue, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
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
        <motion.p className="font-display text-3xl">
            <motion.span>{displayValue}</motion.span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StatCard;
