import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  Target,
  Trophy,
  Zap,
  Loader2
} from "lucide-react";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";
import { useAuth } from "../contexts/AuthContext";
import { useGameProgress } from "../hooks/useGameProgress";
import { dashboardService } from "../services";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCoins: 0,
    currentLevel: 1,
    questionsAnswered: 0,
    totalScore: 0,
    levelProgress: 0,
    winRate: "0%" 
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const { progress: gameProgress, isLoading: isProgressLoading } = useGameProgress();

  useEffect(() => {
    if (!gameProgress) return;
    
    const fetchData = async () => {
      try {
        const [statsData, achievementsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAchievements()
        ]);

        const realStats = statsData?.stats || statsData || {};
        
        // Calculate Level Progress (assuming max 3000 XP per level for UI consistency or use backend data)
        const currentXP = realStats.levelProgress || 0; // If backend provides XP
        const maxXP = 3000; 

        setStats({
          totalCoins: gameProgress.totalCoins || 0,
          currentLevel: gameProgress.currentLevel || 1,
          questionsAnswered: gameProgress.questionsAnswered || 0,
          totalScore: gameProgress.totalScore || 0,
          levelProgress: currentXP,
          winRate: realStats.winRate || "0%"
        });

        // Handle Achievements
        let achievementsArray: any[] = [];
        const rawAchievements = achievementsData?.achievements || achievementsData || {};
        
        if (Array.isArray(achievementsData)) {
            achievementsArray = achievementsData;
        } else {
             const achievementMeta: Record<string, { title: string, description: string, emoji: string }> = {
                firstSteps: { title: "First Steps", description: "Answer 5 questions", emoji: "🌟" },
                levelMaster: { title: "Level Master", description: "Complete 5 levels", emoji: "🦁" },
                coinCollector: { title: "Coin Collector", description: "Earn 500 coins", emoji: "🪙" },
                dedicated: { title: "Dedicated", description: "Answer 50 questions", emoji: "🧠" },
                champion: { title: "Arena Champion", description: "Win 10 PvP matches", emoji: "⚔️" }
            };

            achievementsArray = Object.keys(achievementMeta).map(key => ({
                name: achievementMeta[key].title,
                description: achievementMeta[key].description,
                emoji: achievementMeta[key].emoji,
                unlocked: !!rawAchievements[key]
            }));
        }
        setAchievements(achievementsArray);

        // Handle Recent Activity
        const activity = statsData?.recentActivity || [];
        setRecentActivity(activity.map((a: any) => ({
            action: a.action,
            time: a.time, // Ensure backend sends relative time string or format it
            coins: a.coins ? `+${a.coins} 🪙` : ""
        })));

      } catch (error) {
        console.error("Failed to load dashboard", error);
        toast.error("Could not load your jungle stats");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
        fetchData();
    }
  }, [user, gameProgress]);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "100%" : "0%";
    const diff = ((current - previous) / previous) * 100;
    return `${Math.abs(Math.round(diff))}%`;
  };

  const statCards = [
    { 
      title: "Total Coins", 
      value: stats.totalCoins.toLocaleString(), 
      icon: Brain, 
      change: calculateTrend(stats.totalCoins, 200), // Default signup bonus is 200
      trend: stats.totalCoins >= 200 ? ("up" as const) : ("down" as const), 
      emoji: "💰" 
    },
    { 
      title: "Jungle Level", 
      value: stats.currentLevel.toString(), 
      icon: Target, 
      change: (stats.currentLevel - 1).toString(), 
      trend: "up" as const, 
      emoji: "🌿" 
    },
    { 
      title: "Win Rate", 
      value: stats.winRate, 
      icon: Trophy, 
      change: stats.winRate, 
      trend: "up" as const, 
      emoji: "🏆" 
    },
    { 
      title: "Questions", 
      value: stats.questionsAnswered.toString(), 
      icon: Zap, 
      change: stats.questionsAnswered.toString(), 
      trend: "up" as const, 
      emoji: "⚡" 
    },
  ];

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Loader2 className="w-10 h-10 text-primary animate-spin z-10" />
      </div>
    );
  }

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
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 bg-muted/20">
              <img 
                src={
                  user?.avatar === 'panther' ? pantherImg : 
                  user?.avatar === 'snake' ? snakeImg : 
                  owlImg
                } 
                alt="Your avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl mb-1">
                Welcome back, <span className="gradient-text">{user?.name}</span> 🌿
              </h1>
              <p className="text-muted-foreground">
                Mind Quest awaits! Here's your adventure overview.
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
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
                    <span className="font-display text-3xl">{stats.currentLevel}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Level {stats.currentLevel} — Deep Jungle</span>
                      <span className="text-muted-foreground text-sm">{stats.levelProgress} / 3000 XP</span>
                    </div>
                    <ProgressBar value={stats.levelProgress} max={3000} showValue={false} />
                    <p className="text-sm text-muted-foreground mt-2">
                      {3000 - stats.levelProgress} XP until you reach the Ancient Temple 🏛️
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
                    title="Mind Quest"
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
                    path="/games"
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
                  <span className="text-sm text-muted-foreground">
                    {achievements.filter(a => a.unlocked).length}/{achievements.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        achievement.unlocked
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/30 opacity-60"
                      }`}
                    >
                      <div className="text-2xl">{achievement.emoji || '🏆'}</div>
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
                  {achievements.length === 0 && <p className="text-sm text-muted-foreground">No trophies yet.</p>}
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
                          {activity.coins && <span className="text-xs text-secondary font-bold">{activity.coins}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
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
