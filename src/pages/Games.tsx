import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { Brain, Swords, Users, Gamepad2 } from "lucide-react";

const Games = () => {
  const games = [
    {
      title: "Jungle Quest",
      description: "Embark on wisdom challenges crafted by the jungle animals. Complete 5 riddles per level and earn bananas as you climb deeper into the wild!",
      icon: Brain,
      path: "/games/mind-quest",
      gradient: "cyan" as const,
      players: "1,234",
      featured: true,
      emoji: "🦉",
    },
    {
      title: "Arena vs AI",
      description: "Challenge the cunning Snake in Stone-Paper-Scissors. Bet bananas and win 2x if you defeat them in 3 out of 5 rounds!",
      icon: Gamepad2,
      path: "/games/sps-ai",
      gradient: "magenta" as const,
      players: "567",
      emoji: "🐍",
    },
    {
      title: "PvP Arena",
      description: "Real-time matchmaking against adventurers worldwide. Prove your skills in competitive jungle duels!",
      icon: Swords,
      path: "/games/pvp",
      gradient: "purple" as const,
      players: "892",
      emoji: "⚔️",
    },
    {
      title: "Secret Dens",
      description: "Create or join private dens with unique 4-character codes. Play with your pack in exclusive matches!",
      icon: Users,
      path: "/games/private",
      gradient: "cyan" as const,
      players: "234",
      emoji: "🏕️",
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
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              Choose Your <span className="gradient-text">Adventure</span> 🌴
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From wisdom quests to arena battles — pick your path through the jungle and start earning bananas!
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
            <h2 className="font-display text-2xl mb-6 text-center">
              Jungle <span className="text-primary">Activity</span> 🐾
            </h2>
            <div className="grid sm:grid-cols-4 gap-6">
              {[
                { label: "Active Explorers", value: "2,893", emoji: "🐾" },
                { label: "Games Today", value: "12,456", emoji: "🎮" },
                { label: "Bananas Won", value: "1.2M", emoji: "🍌" },
                { label: "Quests Completed", value: "45,678", emoji: "🏆" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="font-display text-3xl gradient-text mb-1">
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
