import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { 
  Hand, 
  FileText, 
  Scissors,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import snakeImg from "@/assets/snake-character.png";

type Choice = "stone" | "paper" | "scissors" | null;
type Result = "win" | "lose" | "draw";

const choices: { id: Choice; icon: any; label: string; emoji: string }[] = [
  { id: "stone", icon: Hand, label: "Stone", emoji: "🪨" },
  { id: "paper", icon: FileText, label: "Leaf", emoji: "🍃" },
  { id: "scissors", icon: Scissors, label: "Claw", emoji: "🦀" },
];

const SPSGame = () => {
  const [betAmount, setBetAmount] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [aiChoice, setAiChoice] = useState<Choice>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const totalRounds = 5;
  const playerWins = results.filter(r => r === "win").length;
  const aiWins = results.filter(r => r === "lose").length;

  const getResult = (player: Choice, ai: Choice): Result => {
    if (player === ai) return "draw";
    if (
      (player === "stone" && ai === "scissors") ||
      (player === "paper" && ai === "stone") ||
      (player === "scissors" && ai === "paper")
    ) {
      return "win";
    }
    return "lose";
  };

  const makeChoice = (choice: Choice) => {
    if (isRevealing || !choice) return;
    
    setPlayerChoice(choice);
    setIsRevealing(true);
    
    const aiPick = choices[Math.floor(Math.random() * choices.length)].id;
    
    setTimeout(() => {
      setAiChoice(aiPick);
      const result = getResult(choice, aiPick);
      setResults(prev => [...prev, result]);
      
      setTimeout(() => {
        if (currentRound >= totalRounds || playerWins >= 3 || aiWins >= 3) {
          setGameEnded(true);
        } else {
          setCurrentRound(prev => prev + 1);
          setPlayerChoice(null);
          setAiChoice(null);
          setIsRevealing(false);
        }
      }, 1500);
    }, 1000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentRound(1);
    setPlayerChoice(null);
    setAiChoice(null);
    setResults([]);
    setIsRevealing(false);
    setGameEnded(false);
  };

  const playerWon = playerWins >= 3;
  const winnings = playerWon ? betAmount * 2 : 0;

  // Game End Screen
  if (gameEnded) {
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
              {playerWon ? "🏆" : "🐍"}
            </motion.div>
            
            <h2 className="font-display text-3xl mb-2">
              {playerWon ? (
                <>You <span className="gradient-text">Won!</span> 🎉</>
              ) : (
                <>Snake <span className="text-secondary">Wins!</span> 🐍</>
              )}
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Final Score: {playerWins} - {aiWins}
            </p>
            
            {playerWon && (
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-secondary mb-8">
                🍌 +{winnings} Bananas
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games" className="btn-neon-outline">
                Back to Jungle
              </Link>
              <button onClick={resetGame} className="btn-jungle flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Betting Screen
  if (!gameStarted) {
    return (
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <Navbar />
        
        <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center max-w-md w-full"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-secondary/30 mx-auto mb-6"
            >
              <img src={snakeImg} alt="Snake Opponent" className="w-full h-full object-cover" />
            </motion.div>
            
            <h1 className="font-display text-3xl mb-2">
              Stone Leaf <span className="text-secondary jungle-glow-gold">Claw!</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Beat the Snake 3 out of 5 rounds to double your bet! 🐍
            </p>
            
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block font-bold">
                🍌 Place Your Bet
              </label>
              <div className="flex gap-2 justify-center">
                {[25, 50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      betAmount === amount
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-lg mb-6">
              <span>🍌</span>
              <span className="font-bold">{betAmount}</span>
              <span className="text-muted-foreground">→ Win</span>
              <span className="font-bold text-primary">{betAmount * 2} 🍌</span>
            </div>
            
            <button
              onClick={() => setGameStarted(true)}
              className="btn-jungle w-full text-lg"
            >
              🐍 Challenge Snake!
            </button>
            
            <Link 
              to="/games" 
              className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jungle
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Round</span>
                <p className="font-display text-2xl">{currentRound}/{totalRounds}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Score</span>
                <p className="font-display text-2xl">
                  <span className="text-primary">{playerWins}</span>
                  <span className="text-muted-foreground mx-2">-</span>
                  <span className="text-destructive">{aiWins}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Prize</span>
                <div className="flex items-center gap-1 justify-end">
                  <span>🍌</span>
                  <span className="font-display text-2xl text-secondary">{betAmount * 2}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Battle Arena */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Player Side */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground mb-2 block">You 🐾</span>
                <motion.div
                  animate={playerChoice ? { scale: [1, 1.1, 1] } : {}}
                  className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center ${
                    playerChoice
                      ? "bg-gradient-to-br from-primary to-jungle-emerald"
                      : "bg-muted/50"
                  }`}
                >
                  {playerChoice && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-4xl"
                    >
                      {choices.find(c => c.id === playerChoice)?.emoji}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <span className="font-display text-3xl text-muted-foreground">VS</span>
              </div>

              {/* AI Side */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground mb-2 block">Snake 🐍</span>
                <motion.div
                  animate={aiChoice ? { scale: [1, 1.1, 1] } : isRevealing ? { rotate: [0, 360] } : {}}
                  transition={isRevealing && !aiChoice ? { duration: 0.5, repeat: Infinity } : {}}
                  className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center ${
                    aiChoice
                      ? "bg-gradient-to-br from-secondary to-jungle-amber"
                      : "bg-muted/50"
                  }`}
                >
                  {aiChoice && (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-4xl"
                    >
                      {choices.find(c => c.id === aiChoice)?.emoji}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Result Display */}
            {aiChoice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <span className={`font-display text-2xl ${
                  results[results.length - 1] === "win" 
                    ? "text-primary" 
                    : results[results.length - 1] === "lose"
                    ? "text-destructive"
                    : "text-secondary"
                }`}>
                  {results[results.length - 1] === "win" 
                    ? "🎉 You Win This Round!" 
                    : results[results.length - 1] === "lose"
                    ? "🐍 Snake Wins This Round!"
                    : "🤝 It's a Draw!"}
                </span>
              </motion.div>
            )}

            {/* Choice Buttons */}
            {!isRevealing && (
              <div>
                <p className="text-center text-muted-foreground mb-4 font-bold">Choose your weapon!</p>
                <div className="flex justify-center gap-4">
                  {choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => makeChoice(choice.id)}
                      className="w-24 h-24 rounded-2xl bg-muted/50 hover:bg-muted flex flex-col items-center justify-center gap-1 transition-colors border border-primary/10 hover:border-primary/30"
                    >
                      <span className="text-3xl">{choice.emoji}</span>
                      <span className="text-xs text-muted-foreground font-bold">{choice.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Round History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex justify-center gap-2"
          >
            {[...Array(totalRounds)].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                  results[i] === "win"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : results[i] === "lose"
                    ? "bg-destructive/20 text-destructive border border-destructive/30"
                    : results[i] === "draw"
                    ? "bg-secondary/20 text-secondary border border-secondary/30"
                    : i === currentRound - 1
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SPSGame;
