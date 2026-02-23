import { motion } from "framer-motion";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";

const features = [
  {
    emoji: "🦉",
    image: owlImg,
    title: "Wisdom Challenges",
    description: "Wise Owl crafts personalized questions based on your interests and jungle spirit.",
    color: "primary" as const,
  },
  {
    emoji: "🐆",
    image: pantherImg,
    title: "Arena Battles",
    description: "Challenge Shadow Panther and other animals in fast-paced competitive matches.",
    color: "secondary" as const,
  },
  {
    emoji: "🐾",
    title: "The Pack",
    description: "Connect with your pack, chat in real-time, and build your jungle network.",
    color: "primary" as const,
  },
  {
    emoji: "🏆",
    title: "Jungle Trophies",
    description: "Unlock badges and treasures as you explore deeper into the jungle.",
    color: "secondary" as const,
  },
  {
    emoji: "🪙",
    title: "Coin Economy",
    description: "Earn coins, place bets, and grow your stash with every victory.",
    color: "primary" as const,
  },
  {
    emoji: "🐍",
    image: snakeImg,
    title: "Secret Dens",
    description: "Create exclusive dens with codes to play with your inner circle of friends.",
    color: "secondary" as const,
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
          <h2 className="font-display text-3xl sm:text-4xl mb-4">
            Explore the <span className="gradient-text">Wild</span> 🌴
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every creature in the jungle has something to teach you. Discover your path through challenges, battles, and friendships.
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
              <div className="flex items-center gap-3 mb-4">
                {feature.image ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/20">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      feature.color === "primary"
                        ? "bg-primary/10"
                        : "bg-secondary/10"
                    }`}
                  >
                    {feature.emoji}
                  </div>
                )}
              </div>
              <h3 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">
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
