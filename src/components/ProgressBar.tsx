import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const ProgressBar = ({ value, max, label, showValue = true, className = "" }: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className="progress-bar-glow">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
