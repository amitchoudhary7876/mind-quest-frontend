import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />

        {/* CTA Section */}
        <section className="relative py-24 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 sm:p-12 text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Start Your <span className="gradient-text">Quest?</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join thousands of players and embark on a journey of self-discovery and competitive gaming.
                </p>
                <Link to="/auth" className="btn-neon inline-flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 px-4 border-t border-border">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-display font-bold text-xl gradient-text">Mind Quest</div>
              <p className="text-muted-foreground text-sm">
                © 2024 Mind Quest. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
