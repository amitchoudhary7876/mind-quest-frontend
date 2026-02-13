import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep jungle gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-canopy)' }} />
      
      {/* Animated jungle blobs */}
      <motion.div
        className="animated-bg-blob w-[600px] h-[600px] -top-40 -left-40 bg-jungle-green"
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="animated-bg-blob w-[500px] h-[500px] top-1/3 -right-40 bg-jungle-gold"
        animate={{
          x: [0, -60, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="animated-bg-blob w-[400px] h-[400px] bottom-0 left-1/3 bg-jungle-emerald"
        animate={{
          x: [0, 50, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fireflies */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-secondary"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.5, 1.2, 0.5],
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Vine-like vertical lines */}
      <div className="absolute left-[10%] top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      <div className="absolute right-[15%] top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      {/* Leaf pattern overlay */}
      <div className="absolute inset-0 leaf-pattern opacity-30" />
    </div>
  );
};

export default AnimatedBackground;
