import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import { 
  Hand,
  FileText,
  Scissors,
  ArrowLeft,
  Swords,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { gameSocketService } from "../services/gameSocket";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";

type Choice = "rock" | "paper" | "scissors";

const choices: { id: Choice; icon: any; label: string; emoji: string }[] = [
  { id: "rock", icon: Hand, label: "Stone", emoji: "🪨" },
  { id: "paper", icon: FileText, label: "Leaf", emoji: "🍃" },
  { id: "scissors", icon: Scissors, label: "Claw", emoji: "🦀" },
];

const SPSPvPGame = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Game State
  const [isSearching, setIsSearching] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [opponentMoved, setOpponentMoved] = useState(false);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null); 
  
  const [roundResult, setRoundResult] = useState<string | null>(null); 
  const [isRevealing, setIsRevealing] = useState(false);
  
  const [scores, setScores] = useState({ p1: 0, p2: 0 }); 
  const [gameEnded, setGameEnded] = useState(false);
  const [finalWinner, setFinalWinner] = useState<'p1' | 'p2' | 'draw' | null>(null);

  // Refs for socket listeners
  const amIPlayer1Ref = useRef(false);
  const roomIdRef = useRef<string | null>(null);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (token) {
        gameSocketService.connect(token);
    }

    const handleMatchFound = (data: any) => {
        setIsSearching(false);
        setGameActive(true);
        setRoomId(data.roomId);
        roomIdRef.current = data.roomId;
        
        const isP1 = data.p1.id === userRef.current?.id;
        amIPlayer1Ref.current = isP1;
        const opp = isP1 ? data.p2 : data.p1;
        setOpponent(opp);
        
        toast.success(`Match found vs ${opp.name}!`);
    };

    const handleOpponentMadeMove = (data: any) => {
        setOpponentMoved(true);
    };

    const handleRoundResult = (data: any) => {
        setIsRevealing(true);
        
        // Match timing to AI game (reveal after delay)
        setTimeout(() => {
            const oppChoiceStr = amIPlayer1Ref.current ? data.p2Choice : data.p1Choice;
            setOpponentChoice(oppChoiceStr);
            
            const myScore = amIPlayer1Ref.current ? data.scores.p1 : data.scores.p2;
            const oppScore = amIPlayer1Ref.current ? data.scores.p2 : data.scores.p1;
            setScores({ p1: myScore, p2: oppScore });

            const iWon = (data.winner === 'p1' && amIPlayer1Ref.current) || (data.winner === 'p2' && !amIPlayer1Ref.current);
            const draw = data.winner === 'draw';
            
            setRoundResult(draw ? "🤝 It's a Draw!" : iWon ? "🎉 You Win This Round!" : "Round Lost");
            
            // Allow user to see result before next round
            setTimeout(() => {
                setIsRevealing(false);
            }, 1500);
        }, 1000);
    };

    const handleNextRound = (data: any) => {
        setCurrentRound(data.round);
        setPlayerChoice(null);
        setOpponentChoice(null);
        setOpponentMoved(false);
        setRoundResult(null);
    };

    const handleGameOver = (data: any) => {
         const iWon = (data.winner === 'p1' && amIPlayer1Ref.current) || (data.winner === 'p2' && !amIPlayer1Ref.current);
         const isDraw = data.winner === 'draw';
         
         setTimeout(() => {
             setFinalWinner(isDraw ? 'draw' : iWon ? 'p1' : 'p2');
             setGameEnded(true);
         }, 2000);
    };

    const handleOpponentLeft = () => {
        toast.error("Opponent disconnected!");
        setGameEnded(true);
        setFinalWinner('p1');
    };

    gameSocketService.onMatchFound(handleMatchFound);
    gameSocketService.onOpponentMadeMove(handleOpponentMadeMove);
    gameSocketService.onRoundResult(handleRoundResult);
    gameSocketService.onNextRound(handleNextRound);
    gameSocketService.onGameOver(handleGameOver);
    gameSocketService.onOpponentLeft(handleOpponentLeft);

    return () => {
        gameSocketService.off('matchFound', handleMatchFound);
        gameSocketService.off('opponentMadeMove', handleOpponentMadeMove);
        gameSocketService.off('roundResult', handleRoundResult);
        gameSocketService.off('nextRound', handleNextRound);
        gameSocketService.off('gameOver', handleGameOver);
        gameSocketService.off('opponentLeft', handleOpponentLeft);
    };
  }, [user]);

  const joinQueue = () => {
    if (!user) return;
    setIsSearching(true);
    gameSocketService.joinQueue(user.id, user.name || 'Player');
  };

  const makeChoice = (choice: Choice) => {
    if (!roomIdRef.current || playerChoice || isRevealing) return;
    setPlayerChoice(choice);
    gameSocketService.makeMove(roomIdRef.current, choice);
  };
  
  const handleLeave = () => {
      navigate('/games');
  };

  const getAvatar = (id?: string) => {
      if (id === user?.id) {
          return user?.avatar === 'panther' ? pantherImg : user?.avatar === 'snake' ? snakeImg : owlImg;
      }
      return pantherImg;
  };

  if (!gameActive) {
      return (
        <div className="relative min-h-screen">
            <AnimatedBackground /> 
            <Navbar />
            <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
                <motion.div initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} className="glass-card p-8 text-center max-w-md w-full">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 mx-auto mb-6 bg-muted/20 flex items-center justify-center"
                    >
                      <Swords className="w-12 h-12 text-primary" />
                    </motion.div>
                    
                    <h1 className="font-display text-4xl font-bold mb-2">PvP <span className="gradient-text">Arena</span></h1>
                    <p className="text-muted-foreground mb-8">Beat real players in Stone Leaf Claw! First to 3 wins wins the match! 🐾</p>
                    
                    {isSearching ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-xl font-medium animate-pulse">Searching for opponent...</p>
                        </div>
                    ) : (
                         <button onClick={joinQueue} className="btn-jungle w-full py-4 text-xl flex items-center justify-center gap-2">
                            <Swords className="w-6 h-6" />
                            Challenge Player!
                         </button>
                    )}
                    
                     <Link to="/games" className="inline-flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Jungle
                     </Link>
                </motion.div>
            </main>
        </div>
      );
  }

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
              {finalWinner === 'p1' ? "🏆" : "🐾"}
            </motion.div>
            
            <h2 className="font-display text-3xl mb-2">
              {finalWinner === 'p1' ? (
                <>You <span className="gradient-text">Won!</span> 🎉</>
              ) : finalWinner === 'draw' ? (
                <>It's a <span className="text-secondary">Draw!</span> 🤝</>
              ) : (
                <>Opponent <span className="text-destructive">Wins!</span> 🐾</>
              )}
            </h2>
            
            <p className="text-muted-foreground mb-8">
              Final Score: {scores.p1} - {scores.p2}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games" className="btn-neon-outline">
                Back to Jungle
              </Link>
              <button onClick={() => window.location.reload()} className="btn-jungle flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
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
        <div className="container mx-auto max-w-2xl">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm text-muted-foreground">Round</span>
                        <p className="font-display text-2xl">{currentRound}/5</p>
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <p className="font-display text-2xl">
                            <span className="text-primary">{scores.p1}</span>
                            <span className="text-muted-foreground mx-2">-</span>
                            <span className="text-destructive">{scores.p2}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-muted-foreground">Arena</span>
                        <p className="font-display text-xl gradient-text">PvP Duel</p>
                    </div>
                </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
               <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                        <span className="text-sm text-muted-foreground mb-2 block">You 🐾</span>
                        <motion.div
                          animate={playerChoice ? { scale: [1, 1.1, 1] } : {}}
                          className={`w-28 h-28 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden ${
                            playerChoice ? "bg-gradient-to-br from-primary to-jungle-emerald" : "bg-muted/50"
                          }`}
                        >
                            {playerChoice ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">
                                    {choices.find(c => c.id === playerChoice)?.emoji}
                                </motion.div>
                            ) : (
                                <img src={getAvatar(user?.id)} alt="Your Avatar" className="w-full h-full object-cover opacity-30" />
                            )}
                        </motion.div>
                    </div>

                    <div className="flex items-center justify-center">
                        <span className="font-display text-3xl text-muted-foreground">VS</span>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-muted-foreground mb-2 block">{opponent?.name || 'Enemy'} 🐾</span>
                        <motion.div
                          animate={opponentChoice ? { scale: [1, 1.1, 1] } : (opponentMoved && !isRevealing) ? { rotate: [0, 5, -5, 0] } : {}}
                          transition={(opponentMoved && !isRevealing) ? { duration: 0.5, repeat: Infinity } : {}}
                          className={`w-28 h-28 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden ${
                            opponentChoice ? "bg-gradient-to-br from-secondary to-jungle-amber" : opponentMoved ? "bg-secondary/20 border-2 border-secondary/30" : "bg-muted/50"
                          }`}
                        >
                            {opponentChoice ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">
                                    {choices.find(c => c.id === opponentChoice)?.emoji}
                                </motion.div>
                            ) : (
                                <img src={pantherImg} alt="Opponent Avatar" className={`w-full h-full object-cover ${opponentMoved ? 'opacity-50' : 'opacity-20'}`} />
                            )}
                            {opponentMoved && !opponentChoice && (
                                <div className="absolute bottom-1 bg-secondary px-2 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter shadow-lg">Ready</div>
                            )}
                        </motion.div>
                    </div>
               </div>

               <AnimatePresence mode="wait">
                   {roundResult && (
                       <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-6 h-8">
                           <span className={`font-display text-2xl ${
                               roundResult.includes('Win') ? 'text-primary' : roundResult.includes('Draw') ? 'text-secondary' : 'text-destructive'
                           }`}>
                               {roundResult}
                           </span>
                       </motion.div>
                   )}
               </AnimatePresence>

               {!playerChoice && !gameEnded && !isRevealing && (
                   <div>
                       <p className="text-center text-muted-foreground mb-6 font-bold">Choose your weapon!</p>
                       <div className="flex justify-center gap-4">
                           {choices.map(c => (
                               <motion.button 
                                 key={c.id} 
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={() => makeChoice(c.id)}
                                 className="w-24 h-24 bg-muted/50 hover:bg-primary/20 rounded-2xl flex flex-col items-center justify-center transition-all border border-primary/10 hover:border-primary/30"
                               >
                                   <span className="text-4xl mb-1">{c.emoji}</span>
                                   <span className="text-xs text-muted-foreground font-bold">{c.label}</span>
                               </motion.button>
                           ))}
                       </div>
                   </div>
               )}

               {((playerChoice || isRevealing) && !opponentChoice && !gameEnded) && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground animate-pulse font-medium">Waiting for opponent to reveal...</p>
                   </motion.div>
               )}

               <div className="mt-12 flex justify-center">
                   <button onClick={handleLeave} className="text-xs text-muted-foreground hover:text-red-500 hover:underline transition-colors uppercase tracking-widest font-bold">
                       Surrender Match
                   </button>
               </div>
           </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SPSPvPGame;
