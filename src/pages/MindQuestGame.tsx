import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import { 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Trophy
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png"; // Keep new asset
import { gameService } from "../services"; // Import services
import { toast } from "sonner";

const MindQuestGame = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; revealedIndex: number } | null>(null);
  const [gameState, setGameState] = useState<"loading" | "playing" | "completed">("loading");
  const [gameData, setGameData] = useState<any>(null);
  const [completionData, setCompletionData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadGame();
  }, [user]);

  const loadGame = async () => {
    try {
      setGameState("loading");
      const data = await gameService.getCurrentLevel();
      setGameData(data);
      setCurrentQuestionIndex(data.questionsAnswered);
      setGameState("playing");
      setSelectedOption(null);
      setFeedback(null);
    } catch (error) {
      console.error("Failed to load game", error);
      toast.error("Failed to load game session");
      navigate("/games");
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null || feedback) return;
    
    setIsSubmitting(true);
    try {
      const currentQ = gameData.questions[currentQuestionIndex];
      // Send the index as a string for the current backend implementation
      const result = await gameService.answerQuestion(currentQ.question, selectedOption.toString());
      
      setFeedback({ 
        isCorrect: result.isValid, 
        revealedIndex: result.correctAnswerIndex 
      });

      if (result.isValid) {
        toast.success("Correct Answer! 🌿");
      } else {
        toast.error("Incorrect Answer 🦉");
      }

      // Wait a bit for the user to see feedback
      setTimeout(async () => {
        if (currentQuestionIndex + 1 >= 5) {
          const res = await gameService.completeLevel();
          setCompletionData(res);
          setGameState("completed");
        } else {
          const data = await gameService.getCurrentLevel();
          setGameData(data);
          setCurrentQuestionIndex(data.questionsAnswered);
          setSelectedOption(null);
          setFeedback(null);
        }
      }, 1500);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit answer");
      if (error.response?.data?.message?.includes("Level Failed")) {
        loadGame();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuestions = 5;

  if (gameState === "loading") {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <Loader2 className="w-10 h-10 text-primary animate-spin z-10" />
      </div>
    );
  }

  if (gameState === "completed" && completionData) {
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
              Accuracy: <span className="text-primary font-bold">{completionData.accuracy}</span> 🌿
            </p>
            
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-secondary mb-8">
              🪙 +{completionData.coinsEarned} Coins
            </div>
            
             <div className="bg-muted/30 rounded-xl p-4 mb-8">
                <p className="text-sm text-muted-foreground">Total Coins</p>
                <p className="text-2xl font-bold text-yellow-400">{completionData.totalCoins}</p>
             </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games" className="btn-neon-outline">
                Back to Jungle
              </Link>
              <button 
                onClick={() => {
                  loadGame();
                }}
                className="btn-jungle"
              >
                🌿 Next Level
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const currentQuestionObj = gameData?.questions[currentQuestionIndex];

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
              <span className="text-lg">🪙</span>
              <span className="font-bold text-secondary">{gameData?.totalCoins}</span>
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
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/30 bg-muted/20">
                  <img 
                    src={
                        user?.avatar === 'panther' ? pantherImg : 
                        user?.avatar === 'snake' ? snakeImg : 
                        owlImg
                    } 
                    alt="Character" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h1 className="font-display text-xl">Mind Quest</h1>
                  <p className="text-sm text-muted-foreground">Level {gameData?.level} — Deep Jungle</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl gradient-text">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </span>
              </div>
            </div>
            <ProgressBar value={currentQuestionIndex + 1} max={totalQuestions} showValue={false} />
          </motion.div>

          {/* Question Card */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card p-8 mb-6"
          >
            <div className="flex items-center gap-2 text-primary mb-4">
              <span className="text-lg">🦉</span>
              <span className="text-sm font-bold">Wise Owl asks...</span>
            </div>
            
            <h2 className="font-display text-2xl mb-8">
              {currentQuestionObj?.question}
            </h2>
            
            <div className="grid gap-4 mb-8">
              {currentQuestionObj?.options?.map((option: string, index: number) => {
                const isSelected = selectedOption === index;
                const isCorrect = feedback?.revealedIndex === index;
                const isIncorrect = feedback && isSelected && !feedback.isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !feedback && setSelectedOption(index)}
                    disabled={isSubmitting || !!feedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                      isCorrect 
                        ? "bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-green-400"
                        : isIncorrect
                        ? "bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-red-400"
                        : isSelected
                        ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isCorrect ? "border-green-500 bg-green-500 text-white" :
                      isIncorrect ? "border-red-500 bg-red-500 text-white" :
                      isSelected ? "border-primary bg-primary text-white" : "border-white/20"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-semibold">{option}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null || isSubmitting || !!feedback}
                className="btn-jungle flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Submit Answer
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MindQuestGame;
