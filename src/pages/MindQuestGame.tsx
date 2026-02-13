import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import { 
  ChevronRight, 
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import owlImg from "@/assets/owl-character.png";

const MindQuestGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "completed">("playing");
  
  const level = 15;
  const totalQuestions = 5;
  const coinsReward = 50 + level * 10;

  const questions = [
    "What's a challenge you've overcome that changed your perspective on life?",
    "If you could master any skill overnight, what would it be and why?",
    "Describe a moment when you felt truly proud of yourself.",
    "What's a belief you held strongly but later changed your mind about?",
    "If you could give advice to your younger self, what would it be?",
  ];

  const handleSubmit = () => {
    if (answer.trim().length < 10) return;
    
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setAnswer("");
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setGameState("completed");
    }
  };

  const validAnswers = answers.filter(a => a.length >= 20).length;

  if (gameState === "completed") {
    const passed = validAnswers >= 3;
    
    return (
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <Navbar />
        
        <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 sm:p-12 text-center max-w-lg w-full"
          >
            {passed ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-7xl mb-6"
                >
                  🏆
                </motion.div>
                
                <h2 className="font-display text-3xl mb-2">
                  Level <span className="gradient-text">Complete!</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  You've conquered Level {level} of the jungle! 🌿
                </p>
                
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-secondary mb-8">
                  🍌 +{coinsReward} Bananas
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/games" className="btn-neon-outline">
                    Back to Jungle
                  </Link>
                  <button 
                    onClick={() => {
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setGameState("playing");
                    }}
                    className="btn-jungle"
                  >
                    🌿 Next Level
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-7xl mb-6">😤</div>
                
                <h2 className="font-display text-3xl mb-2">
                  Keep <span className="text-destructive">Trying!</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  You need at least 3 thoughtful answers to pass. You had {validAnswers}.
                </p>
                
                <button 
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setGameState("playing");
                  }}
                  className="btn-jungle"
                >
                  🔄 Try Again
                </button>
              </>
            )}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link to="/games" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Exit Jungle</span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
              <span className="text-lg">🍌</span>
              <span className="font-bold text-secondary">+{coinsReward}</span>
            </div>
          </motion.div>

          {/* Level Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/30">
                  <img src={owlImg} alt="Wise Owl" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="font-display text-xl">Jungle Quest</h1>
                  <p className="text-sm text-muted-foreground">Level {level} — Deep Jungle</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl gradient-text">
                  {currentQuestion + 1}/{totalQuestions}
                </span>
              </div>
            </div>
            <ProgressBar value={currentQuestion + 1} max={totalQuestions} showValue={false} />
          </motion.div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card p-8 mb-6"
          >
            <div className="flex items-center gap-2 text-primary mb-4">
              <span className="text-lg">🦉</span>
              <span className="text-sm font-bold">Wise Owl asks...</span>
            </div>
            
            <h2 className="font-display text-2xl mb-6">
              {questions[currentQuestion]}
            </h2>
            
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughtful response... (minimum 10 characters)"
              className="input-glass w-full h-40 resize-none"
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className={`text-sm ${answer.length >= 10 ? "text-primary" : "text-muted-foreground"}`}>
                {answer.length} characters {answer.length < 10 && "(min 10)"}
              </span>
              <button
                onClick={handleSubmit}
                disabled={answer.trim().length < 10}
                className="btn-jungle flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion < totalQuestions - 1 ? "Next Question" : "Complete Quest"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Answers Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">🐾 Progress:</span>
              <div className="flex gap-2">
                {[...Array(totalQuestions)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      i < answers.length
                        ? answers[i].length >= 20
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary/20 text-secondary border border-secondary/30"
                        : i === currentQuestion
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MindQuestGame;
