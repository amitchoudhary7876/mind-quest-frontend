import { motion } from "framer-motion";
import { Brain, Swords, Users, Trophy, Coins, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Personalized questions based on your interests and personality profile.",
    color: "primary",
  },
  {
    icon: Swords,
    title: "Real-Time PvP",
    description: "Challenge players worldwide in fast-paced competitive matches.",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Social Hub",
    description: "Connect with friends, chat in real-time, and build your network.",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Unlock badges and rewards as you progress through your journey.",
    color: "secondary",
  },
  {
    icon: Coins,
    title: "Coin Economy",
    description: "Earn coins, place bets, and watch your wealth grow with victories.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Private Rooms",
    description: "Create exclusive rooms with codes to play with your inner circle.",
    color: "secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Unleash Your <span className="gradient-text">Potential</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience a gaming platform designed to challenge your mind and connect you with like-minded individuals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-hover p-6 group"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === "primary"
                    ? "bg-primary/10"
                    : "bg-secondary/10"
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 ${
                    feature.color === "primary"
                      ? "text-primary"
                      : "text-secondary"
                  }`}
                />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
