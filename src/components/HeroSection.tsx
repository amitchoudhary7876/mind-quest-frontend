import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import jungleHero from "@/assets/jungle-hero.jpg";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <img src={jungleHero} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-lg">🦁</span>
              <span className="text-sm font-bold text-primary">Wild Adventure Awaits!</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Welcome to the{" "}
              <span className="gradient-text">Jungle</span>
              <br />
              Start Your{" "}
              <span className="text-secondary jungle-glow-gold">Quest!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Embark on a wild adventure through the jungle! Answer clever riddles from wise animals,
              battle in the arena, and grow your pack in this untamed world of discovery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/auth" className="btn-jungle flex items-center justify-center gap-2 text-lg">
                🌿 Enter the Jungle
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/games" className="btn-neon-outline flex items-center justify-center gap-2">
                🎮 Explore Games
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              {[
                { value: "50K+", label: "Adventurers", emoji: "🐾" },
                { value: "1M+", label: "Quests Done", emoji: "🏆" },
                { value: "4.9★", label: "Rating", emoji: "⭐" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="font-display text-2xl text-secondary">{stat.emoji} {stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Animal Characters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glowing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Center character - Owl (Wisdom) */}
              <motion.div
                className="absolute inset-16 rounded-full overflow-hidden border-4 border-secondary/30"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={owlImg} alt="Wise Owl" className="w-full h-full object-cover" />
              </motion.div>

              {/* Floating characters */}
              <motion.div
                className="absolute top-0 left-1/4 w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 glass-card"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={pantherImg} alt="Panther" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                className="absolute bottom-8 right-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-secondary/30 glass-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <img src={snakeImg} alt="Snake" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                className="absolute top-1/4 right-0 glass-card p-4 rounded-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <span className="text-3xl">🐒</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
