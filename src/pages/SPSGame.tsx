import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { 
  Coins, 
  Hand, 
  FileText, 
  Scissors,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Swords
} from "lucide-react";
import { Link } from "react-router-dom";

type Choice = "stone" | "paper" | "scissors" | null;
type Result = "win" | "lose" | "draw";

const choices: { id: Choice; icon: any; label: string }[] = [
  { id: "stone", icon: Hand, label: "Stone" },
  { id: "paper", icon: FileText, label: "Paper" },
  { id: "scissors", icon: Scissors, label: "Scissors" },
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
    
    // AI makes random choice
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
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                playerWon 
                  ? "bg-gradient-to-br from-primary to-secondary" 
                  : "bg-red-500/20"
              }`}
            >
              {playerWon ? (
                <Trophy className="w-12 h-12 text-primary-foreground" />
              ) : (
                <Swords className="w-12 h-12 text-red-400" />
              )}
            </motion.div>
            
            <h2 className="font-display text-3xl font-bold mb-2">
              {playerWon ? (
                <>You <span className="gradient-text">Won!</span></>
              ) : (
                <>Better <span className="text-red-400">Luck</span> Next Time</>
              )}
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Final Score: {playerWins} - {aiWins}
            </p>
            
            {playerWon && (
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400 mb-8">
                <Coins className="w-8 h-8" />
                +{winnings} Coins
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games" className="btn-neon-outline">
                Back to Games
              </Link>
              <button onClick={resetGame} className="btn-neon flex items-center justify-center gap-2">
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-neon-purple flex items-center justify-center mx-auto mb-6">
              <Swords className="w-10 h-10 text-secondary-foreground" />
            </div>
            
            <h1 className="font-display text-3xl font-bold mb-2">
              Stone Paper <span className="text-secondary neon-text-magenta">Scissors</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Win 3 out of 5 rounds to double your bet!
            </p>
            
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">
                Place Your Bet
              </label>
              <div className="flex gap-2 justify-center">
                {[25, 50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
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
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="font-bold">{betAmount}</span>
              <span className="text-muted-foreground">→ Win</span>
              <span className="font-bold text-green-400">{betAmount * 2}</span>
            </div>
            
            <button
              onClick={() => setGameStarted(true)}
              className="btn-neon w-full"
            >
              Start Game
            </button>
            
            <Link 
              to="/games" 
              className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
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
                <p className="font-display text-2xl font-bold">{currentRound}/{totalRounds}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Score</span>
                <p className="font-display text-2xl font-bold">
                  <span className="text-green-400">{playerWins}</span>
                  <span className="text-muted-foreground mx-2">-</span>
                  <span className="text-red-400">{aiWins}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Prize Pool</span>
                <div className="flex items-center gap-1 justify-end">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="font-display text-2xl font-bold text-yellow-400">{betAmount * 2}</span>
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
                <span className="text-sm text-muted-foreground mb-2 block">You</span>
                <motion.div
                  animate={playerChoice ? { scale: [1, 1.1, 1] } : {}}
                  className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center ${
                    playerChoice
                      ? "bg-gradient-to-br from-primary to-secondary"
                      : "bg-muted/50"
                  }`}
                >
                  {playerChoice && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {(() => {
                        const choice = choices.find(c => c.id === playerChoice);
                        return choice ? <choice.icon className="w-12 h-12 text-primary-foreground" /> : null;
                      })()}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-muted-foreground">VS</span>
              </div>

              {/* AI Side */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground mb-2 block">AI</span>
                <motion.div
                  animate={aiChoice ? { scale: [1, 1.1, 1] } : isRevealing ? { rotate: [0, 360] } : {}}
                  transition={isRevealing && !aiChoice ? { duration: 0.5, repeat: Infinity } : {}}
                  className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center ${
                    aiChoice
                      ? "bg-gradient-to-br from-secondary to-neon-purple"
                      : "bg-muted/50"
                  }`}
                >
                  {aiChoice && (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      {(() => {
                        const choice = choices.find(c => c.id === aiChoice);
                        return choice ? <choice.icon className="w-12 h-12 text-secondary-foreground" /> : null;
                      })()}
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
                <span className={`font-display text-2xl font-bold ${
                  results[results.length - 1] === "win" 
                    ? "text-green-400" 
                    : results[results.length - 1] === "lose"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}>
                  {results[results.length - 1] === "win" 
                    ? "You Win This Round!" 
                    : results[results.length - 1] === "lose"
                    ? "AI Wins This Round!"
                    : "It's a Draw!"}
                </span>
              </motion.div>
            )}

            {/* Choice Buttons */}
            {!isRevealing && (
              <div>
                <p className="text-center text-muted-foreground mb-4">Make your choice</p>
                <div className="flex justify-center gap-4">
                  {choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => makeChoice(choice.id)}
                      className="w-20 h-20 rounded-2xl bg-muted/50 hover:bg-muted flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <choice.icon className="w-8 h-8" />
                      <span className="text-xs text-muted-foreground">{choice.label}</span>
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
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${
                  results[i] === "win"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : results[i] === "lose"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : results[i] === "draw"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
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
