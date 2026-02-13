import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import ProgressBar from "@/components/ProgressBar";
import GameCard from "@/components/GameCard";
import { 
  Brain, 
  Swords, 
  Star,
  Clock,
} from "lucide-react";
import owlImg from "@/assets/owl-character.png";

const Dashboard = () => {
  const stats = [
    { title: "Total Bananas", value: "1,250", icon: Brain, change: "12%", trend: "up" as const, emoji: "🍌" },
    { title: "Jungle Level", value: "15", icon: Brain, change: "1", trend: "up" as const, emoji: "🌿" },
    { title: "Win Rate", value: "67%", icon: Brain, change: "5%", trend: "up" as const, emoji: "🏆" },
    { title: "XP Today", value: "340", icon: Brain, change: "89", trend: "up" as const, emoji: "⚡" },
  ];

  const achievements = [
    { name: "First Quest", description: "Complete your first jungle quest", unlocked: true, emoji: "🌟" },
    { name: "Banana Collector", description: "Earn 500 bananas", unlocked: true, emoji: "🍌" },
    { name: "Jungle Master", description: "Answer 100 questions correctly", unlocked: false, emoji: "🦁" },
    { name: "Arena Champion", description: "Win 10 PvP matches", unlocked: false, emoji: "⚔️" },
  ];

  const recentActivity = [
    { action: "Completed Jungle Quest Level 15", time: "2 min ago", coins: "+75 🍌" },
    { action: "Won SPS match vs WildCat99", time: "15 min ago", coins: "+50 🍌" },
    { action: "Daily jungle bonus", time: "1 hour ago", coins: "+20 🍌" },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30">
              <img src={owlImg} alt="Your avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl mb-1">
                Welcome back, <span className="gradient-text">Explorer</span> 🌿
              </h1>
              <p className="text-muted-foreground">
                The jungle awaits! Here's your adventure overview.
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} delay={index * 0.1} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h2 className="font-display text-xl mb-4">🗺️ Jungle Progress</h2>
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="font-display text-3xl">15</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Level 15 — Deep Jungle</span>
                      <span className="text-muted-foreground text-sm">2,340 / 3,000 XP</span>
                    </div>
                    <ProgressBar value={2340} max={3000} showValue={false} />
                    <p className="text-sm text-muted-foreground mt-2">
                      660 XP until you reach the Ancient Temple 🏛️
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Play */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-display text-xl mb-4">🎮 Quick Play</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <GameCard
                    title="Jungle Quest"
                    description="Wisdom challenges from the animals"
                    icon={Brain}
                    path="/games/mind-quest"
                    gradient="cyan"
                    players="1.2K"
                    emoji="🦉"
                  />
                  <GameCard
                    title="Arena Battle"
                    description="Stone Paper Scissors showdowns"
                    icon={Swords}
                    path="/games/sps"
                    gradient="magenta"
                    players="856"
                    emoji="⚔️"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl">🏅 Trophies</h2>
                  <span className="text-sm text-muted-foreground">2/4</span>
                </div>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        achievement.unlocked
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/30 opacity-60"
                      }`}
                    >
                      <div className="text-2xl">{achievement.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Star className="w-5 h-5 text-secondary flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          <span className="text-xs text-secondary font-bold">{activity.coins}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
