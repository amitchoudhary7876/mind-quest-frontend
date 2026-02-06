import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import ProgressBar from "@/components/ProgressBar";
import GameCard from "@/components/GameCard";
import { 
  Coins, 
  Trophy, 
  Target, 
  Zap, 
  Brain, 
  Swords, 
  Star,
  Clock,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Total Coins", value: "1,250", icon: Coins, change: "12%", trend: "up" as const },
    { title: "Current Level", value: "15", icon: Target, change: "1", trend: "up" as const },
    { title: "Win Rate", value: "67%", icon: Trophy, change: "5%", trend: "up" as const },
    { title: "XP Today", value: "340", icon: Zap, change: "89", trend: "up" as const },
  ];

  const achievements = [
    { name: "First Quest", description: "Complete your first quest", unlocked: true, icon: Star },
    { name: "Coin Collector", description: "Earn 500 coins", unlocked: true, icon: Coins },
    { name: "Brain Master", description: "Answer 100 questions correctly", unlocked: false, icon: Brain },
    { name: "PvP Champion", description: "Win 10 PvP matches", unlocked: false, icon: Swords },
  ];

  const recentActivity = [
    { action: "Completed Mind Quest Level 15", time: "2 min ago", coins: "+75" },
    { action: "Won SPS match vs Player123", time: "15 min ago", coins: "+50" },
    { action: "Daily login bonus", time: "1 hour ago", coins: "+20" },
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
            className="mb-8"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">Player</span>
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your quest? Here's your progress overview.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} delay={index * 0.1} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Progress & Quick Play */}
            <div className="lg:col-span-2 space-y-6">
              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h2 className="font-display text-xl font-semibold mb-4">Level Progress</h2>
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="font-display text-3xl font-bold">15</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Level 15</span>
                      <span className="text-muted-foreground text-sm">2,340 / 3,000 XP</span>
                    </div>
                    <ProgressBar value={2340} max={3000} showValue={false} />
                    <p className="text-sm text-muted-foreground mt-2">
                      660 XP until next level
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
                <h2 className="font-display text-xl font-semibold mb-4">Quick Play</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <GameCard
                    title="Mind Quest"
                    description="AI-powered personality questions"
                    icon={Brain}
                    path="/games/mind-quest"
                    gradient="cyan"
                    players="1.2K"
                  />
                  <GameCard
                    title="SPS Arena"
                    description="Stone Paper Scissors battles"
                    icon={Swords}
                    path="/games/sps"
                    gradient="magenta"
                    players="856"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column - Achievements & Activity */}
            <div className="space-y-6">
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">Achievements</h2>
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
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <achievement.icon className={`w-5 h-5 ${
                          achievement.unlocked ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
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
                  <h2 className="font-display text-xl font-semibold">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          <span className="text-xs text-green-400 font-medium">{activity.coins}</span>
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
