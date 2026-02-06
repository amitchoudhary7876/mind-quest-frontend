import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { Brain, Swords, Users, Gamepad2 } from "lucide-react";

const Games = () => {
  const games = [
    {
      title: "Mind Quest",
      description: "Embark on an AI-powered journey with personalized questions based on your interests. Complete 5 questions per level and earn coins as you progress.",
      icon: Brain,
      path: "/games/mind-quest",
      gradient: "cyan" as const,
      players: "1,234",
      featured: true,
    },
    {
      title: "SPS vs AI",
      description: "Challenge our smart AI in Stone-Paper-Scissors. Bet coins and win 2x if you beat the AI in 3 out of 5 rounds.",
      icon: Gamepad2,
      path: "/games/sps-ai",
      gradient: "magenta" as const,
      players: "567",
    },
    {
      title: "PvP Arena",
      description: "Real-time matchmaking against players worldwide. Prove your skills in competitive matches.",
      icon: Swords,
      path: "/games/pvp",
      gradient: "purple" as const,
      players: "892",
    },
    {
      title: "Private Rooms",
      description: "Create or join private rooms with unique 4-character codes. Play with friends in exclusive matches.",
      icon: Users,
      path: "/games/private",
      gradient: "cyan" as const,
      players: "234",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Choose Your <span className="gradient-text">Battle</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From mind-bending quests to competitive PvP action - pick your game and start earning.
            </p>
          </motion.div>

          {/* Games Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={game.featured ? "sm:col-span-2" : ""}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </div>

          {/* Game Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass-card p-8"
          >
            <h2 className="font-display text-2xl font-bold mb-6 text-center">
              Live <span className="text-primary">Statistics</span>
            </h2>
            <div className="grid sm:grid-cols-4 gap-6">
              {[
                { label: "Active Players", value: "2,893" },
                { label: "Games Today", value: "12,456" },
                { label: "Coins Won", value: "1.2M" },
                { label: "Quests Completed", value: "45,678" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Games;
